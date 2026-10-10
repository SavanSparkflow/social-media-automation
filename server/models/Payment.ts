import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        amount: { type: Number, required: true }, // In INR (e.g. 499)
        currency: { type: String, default: "INR" },
        planType: {
            type: String,
            enum: ["pro", "agency", "credit_pack_100", "credit_pack_500", "credit_pack_1500"],
            required: true,
        },
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly", "one_time"],
            default: "monthly",
        },
        creditsAdded: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["created", "success", "failed"],
            default: "created",
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
