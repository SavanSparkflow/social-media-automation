import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const PLANS_CONFIG: Record<string, { amount: number; plan: "pro" | "agency"; cycle: "monthly" | "yearly"; credits: number; maxAccounts: number; days: number }> = {
    pro_monthly: { amount: 499, plan: "pro", cycle: "monthly", credits: 500, maxAccounts: 5, days: 30 },
    pro_yearly: { amount: 4999, plan: "pro", cycle: "yearly", credits: 500, maxAccounts: 5, days: 365 },
    agency_monthly: { amount: 1499, plan: "agency", cycle: "monthly", credits: 2000, maxAccounts: 100, days: 30 },
    agency_yearly: { amount: 14999, plan: "agency", cycle: "yearly", credits: 2000, maxAccounts: 100, days: 365 },
};

const CREDIT_PACKS_CONFIG: Record<string, { amount: number; credits: number }> = {
    credit_pack_100: { amount: 99, credits: 100 },
    credit_pack_500: { amount: 399, credits: 500 },
    credit_pack_1500: { amount: 999, credits: 1500 },
};

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_SVkYHZgMnWC1fP";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "7Z8yE9XuggQKmSqSxY4bKohV";
    return new Razorpay({ key_id, key_secret });
};

// 1. CREATE RAZORPAY ORDER
// POST /api/payment/create-order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { planId } = req.body; // e.g. "pro_monthly", "agency_monthly", "credit_pack_500"

        let amountInRupees = 0;
        let isCreditPack = false;

        if (PLANS_CONFIG[planId]) {
            amountInRupees = PLANS_CONFIG[planId].amount;
        } else if (CREDIT_PACKS_CONFIG[planId]) {
            amountInRupees = CREDIT_PACKS_CONFIG[planId].amount;
            isCreditPack = true;
        } else {
            res.status(400).json({ message: "Invalid plan or credit pack selected." });
            return;
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: amountInRupees * 100, // Amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-4)}`,
            notes: {
                userId: req.user._id.toString(),
                userEmail: req.user.email,
                planId,
                isCreditPack: isCreditPack ? "true" : "false",
            },
        };

        const order = await razorpay.orders.create(options);

        // Record initial payment record
        await Payment.create({
            userId: req.user._id,
            razorpayOrderId: order.id,
            amount: amountInRupees,
            currency: "INR",
            planType: isCreditPack ? planId : PLANS_CONFIG[planId].plan,
            billingCycle: isCreditPack ? "one_time" : PLANS_CONFIG[planId].cycle,
            status: "created",
        });

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SVkYHZgMnWC1fP",
            user: {
                name: req.user.name,
                email: req.user.email,
            },
        });
    } catch (error: any) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: error.message || "Failed to initiate payment order." });
    }
};

// 2. VERIFY RAZORPAY PAYMENT & ACTIVATE PLAN / CREDITS
// POST /api/payment/verify-payment
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planId,
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || "7Z8yE9XuggQKmSqSxY4bKohV";

        // Signature Verification
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed", razorpayPaymentId: razorpay_payment_id }
            );
            res.status(400).json({ success: false, message: "Payment signature verification failed." });
            return;
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: "User account not found." });
            return;
        }

        // Determine if it's a subscription plan or credit pack
        if (PLANS_CONFIG[planId]) {
            const config = PLANS_CONFIG[planId];
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + config.days);

            user.plan = config.plan;
            user.planBillingCycle = config.cycle;
            user.planExpiresAt = expirationDate;
            user.maxSocialAccounts = config.maxAccounts;

            // Grant AI Credits
            user.aiCredits = Math.max(user.aiCredits || 0, config.credits);
            user.aiCreditsMax = Math.max(user.aiCreditsMax || 0, config.credits);

            await user.save();

            // Update Payment log
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "success",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                }
            );

            res.status(200).json({
                success: true,
                message: `🎉 Payment Successful! Upgraded to ${config.plan.toUpperCase()} Plan until ${expirationDate.toLocaleDateString()}.`,
                user: {
                    plan: user.plan,
                    planExpiresAt: user.planExpiresAt,
                    aiCredits: user.aiCredits,
                    aiCreditsMax: user.aiCreditsMax,
                    maxSocialAccounts: user.maxSocialAccounts,
                },
            });
        } else if (CREDIT_PACKS_CONFIG[planId]) {
            const creditConfig = CREDIT_PACKS_CONFIG[planId];
            user.aiCredits = (user.aiCredits || 0) + creditConfig.credits;
            user.aiCreditsMax = (user.aiCreditsMax || 0) + creditConfig.credits;

            await user.save();

            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "success",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    creditsAdded: creditConfig.credits,
                }
            );

            res.status(200).json({
                success: true,
                message: `🎉 Payment Successful! Added +${creditConfig.credits} AI Credits to your balance.`,
                user: {
                    plan: user.plan,
                    aiCredits: user.aiCredits,
                    aiCreditsMax: user.aiCreditsMax,
                },
            });
        } else {
            res.status(400).json({ message: "Unrecognized plan ID." });
        }
    } catch (error: any) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: error.message || "Failed to verify payment." });
    }
};

// 3. GET CURRENT SUBSCRIPTION & PAYMENT HISTORY
// GET /api/payment/status
export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id).select(
            "plan planBillingCycle planExpiresAt aiCredits aiCreditsMax maxSocialAccounts geminiApiKey"
        );

        const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);

        // Check if plan has expired
        let isExpired = false;
        if (user?.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
            isExpired = true;
        }

        const activePlan = isExpired ? "free" : user?.plan || "free";

        res.status(200).json({
            plan: activePlan,
            isExpired,
            planBillingCycle: user?.planBillingCycle || "none",
            planExpiresAt: user?.planExpiresAt,
            aiCredits: user?.aiCredits || 0,
            aiCreditsMax: user?.aiCreditsMax || 50,
            maxSocialAccounts: user?.maxSocialAccounts || 1,
            isUnlimited: Boolean(user?.geminiApiKey),
            payments,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch subscription status." });
    }
};
