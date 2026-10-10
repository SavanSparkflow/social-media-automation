import React, { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
    CheckCircle2,
    Crown,
    Sparkles,
    Zap,
    Gift,
    ShieldCheck,
    X,
    Coins,
    Package,
    RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Dynamically load Razorpay SDK
const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

interface UpgradePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "plans" | "credits";
    highlightPlan?: "pro" | "agency";
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
    isOpen,
    onClose,
    defaultTab = "plans",
    highlightPlan = "pro",
}) => {
    const { user, plan: currentPlan, refreshSubscription, refreshCredits } = useAuth();
    const [activeTab, setActiveTab] = useState<"plans" | "credits">(defaultTab);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubscribe = async (planKey: string) => {
        try {
            setIsProcessing(planKey);

            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load. Please check your internet connection.");
                setIsProcessing(null);
                return;
            }

            // 1. Create order on backend
            const { data } = await api.post("/api/payment/create-order", { planId: planKey });
            if (!data.success) {
                toast.error(data.message || "Failed to initiate payment.");
                setIsProcessing(null);
                return;
            }

            // 2. Open Razorpay Checkout modal
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency || "INR",
                name: "SocialAI Automation",
                description: `Upgrade to ${planKey.replace("_", " ").toUpperCase()}`,
                image: "/logo.svg",
                order_id: data.orderId,
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#dc2626", // Red theme
                },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await api.post("/api/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planKey,
                        });

                        if (verifyRes.data.success) {
                            toast.success(verifyRes.data.message || "🎉 Plan Activated Successfully!", {
                                duration: 6000,
                            });
                            await refreshSubscription();
                            await refreshCredits();
                            onClose();
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Payment verification error.");
                    } finally {
                        setIsProcessing(null);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(null);
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", (res: any) => {
                toast.error(res.error.description || "Payment failed.");
                setIsProcessing(null);
            });
            rzp.open();
        } catch (error: any) {
            console.error("Payment process error:", error);
            toast.error(error.response?.data?.message || "Failed to start checkout.");
            setIsProcessing(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[92vh] overflow-y-auto relative p-6 sm:p-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    <X className="size-5" />
                </button>

                {/* Header */}
                <div className="text-center max-w-lg mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                        <Crown className="size-3.5" /> Razorpay Secured Checkout
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Unlock Next-Level Automation
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Choose the plan that fits your growth. Seamless instant activation with UPI, Cards, NetBanking.
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex justify-center mt-6">
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1">
                        <button
                            onClick={() => setActiveTab("plans")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === "plans"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            <Package className={`size-3.5 ${activeTab === "plans" ? "text-red-500" : "text-slate-400"}`} />
                            <span>Subscription Plans</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("credits")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === "credits"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            <Coins className={`size-3.5 ${activeTab === "credits" ? "text-amber-500" : "text-slate-400"}`} />
                            <span>Top-Up AI Credits</span>
                        </button>
                    </div>
                </div>

                {/* TAB 1: SUBSCRIPTION PLANS */}
                {activeTab === "plans" && (
                    <div className="mt-6 space-y-6">
                        {/* Billing Cycle Toggle */}
                        <div className="flex items-center justify-center gap-3">
                            <span
                                className={`text-xs font-semibold cursor-pointer ${
                                    billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"
                                }`}
                                onClick={() => setBillingCycle("monthly")}
                            >
                                Monthly Billing
                            </span>
                            <button
                                type="button"
                                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                                className="relative w-11 h-6 bg-slate-200 rounded-full transition-colors cursor-pointer focus:outline-none"
                            >
                                <span
                                    className={`absolute top-1 left-1 bg-red-600 w-4 h-4 rounded-full transition-transform ${
                                        billingCycle === "yearly" ? "translate-x-5" : ""
                                    }`}
                                />
                            </button>
                            <span
                                className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                                    billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"
                                }`}
                                onClick={() => setBillingCycle("yearly")}
                            >
                                Annual Billing
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    2 Months Free 🎉
                                </span>
                            </span>
                        </div>

                        {/* Plan Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pro Creator Plan */}
                            <div
                                className={`p-6 rounded-2xl border-2 relative transition-all flex flex-col justify-between ${
                                    highlightPlan === "pro" || currentPlan === "free"
                                        ? "border-red-500 bg-red-50/20 shadow-md ring-2 ring-red-500/20"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">Pro Creator</h3>
                                            <p className="text-xs text-slate-500">For creators & small brands</p>
                                        </div>
                                        <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                            <Sparkles className="size-5" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="text-3xl font-extrabold text-slate-900">
                                            {billingCycle === "monthly" ? "₹499" : "₹4,999"}
                                            <span className="text-xs font-normal text-slate-500">
                                                /{billingCycle === "monthly" ? "month" : "year"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {billingCycle === "yearly" ? "Save ₹989 with annual billing" : "Billed monthly, cancel anytime"}
                                        </p>
                                    </div>

                                    <div className="space-y-2.5 pt-2 text-xs text-slate-600">
                                        <div className="flex items-center gap-2 font-medium">
                                            <CheckCircle2 className="size-4 text-red-600 shrink-0" />
                                            <span><strong>500 Monthly AI Credits</strong> or Unlimited BYOK</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-red-600 shrink-0" />
                                            <span><strong>Connect up to 5 Social Accounts</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium text-slate-800">
                                            <CheckCircle2 className="size-4 text-red-600 shrink-0" />
                                            <span><strong>1-Click Multi-Format Content Repurposer</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium text-slate-800">
                                            <CheckCircle2 className="size-4 text-red-600 shrink-0" />
                                            <span><strong>30-Day Campaign Autopilot Planner</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium text-slate-800">
                                            <CheckCircle2 className="size-4 text-red-600 shrink-0" />
                                            <span><strong>Competitor Viral Post Reverse-Engineer</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(`pro_${billingCycle}`)}
                                    disabled={!!isProcessing || currentPlan === "pro"}
                                    className={`mt-6 w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                        currentPlan === "pro"
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                            : "bg-red-600 hover:bg-red-700 text-white"
                                    }`}
                                >
                                    {isProcessing === `pro_${billingCycle}` ? (
                                        <>
                                            <RefreshCw className="size-4 animate-spin" /> Processing Razorpay...
                                        </>
                                    ) : currentPlan === "pro" ? (
                                        "Current Active Plan"
                                    ) : (
                                        <>
                                            <Zap className="size-4" /> Upgrade to Pro Creator
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Agency / Business Plan */}
                            <div
                                className={`p-6 rounded-2xl border-2 relative transition-all flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 text-white ${
                                    highlightPlan === "agency"
                                        ? "border-amber-400 shadow-xl ring-2 ring-amber-400/30"
                                        : "border-slate-800"
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                                                All Features Unlocked
                                            </span>
                                            <h3 className="font-bold text-white text-lg">Agency / Business</h3>
                                            <p className="text-xs text-slate-400">For agencies & scale-ups</p>
                                        </div>
                                        <div className="p-2 bg-amber-400/20 text-amber-400 rounded-xl">
                                            <Crown className="size-5" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="text-3xl font-extrabold text-white">
                                            {billingCycle === "monthly" ? "₹1,499" : "₹14,999"}
                                            <span className="text-xs font-normal text-slate-400">
                                                /{billingCycle === "monthly" ? "month" : "year"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {billingCycle === "yearly" ? "Save ₹2,989 with annual billing" : "Billed monthly, cancel anytime"}
                                        </p>
                                    </div>

                                    <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                                        <div className="flex items-center gap-2 font-medium text-white">
                                            <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                                            <span><strong>2,000 Monthly AI Credits</strong> + Unlimited BYOK</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium text-white">
                                            <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                                            <span><strong>Unlimited Social Media Accounts</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-amber-300">
                                            <Gift className="size-4 text-amber-400 shrink-0" />
                                            <span>🎁 "Comment & Get" Lead Magnet Funnel Studio</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                                            <span>Live Trigger Simulator & Hot Leads CRM</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                                            <span>1-Click Captured Leads CSV Export</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-amber-400 shrink-0" />
                                            <span>All Repurposer & Campaign Autopilot Tools</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(`agency_${billingCycle}`)}
                                    disabled={!!isProcessing || currentPlan === "agency"}
                                    className={`mt-6 w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                        currentPlan === "agency"
                                            ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                                            : "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-bold"
                                    }`}
                                >
                                    {isProcessing === `agency_${billingCycle}` ? (
                                        <>
                                            <RefreshCw className="size-4 animate-spin" /> Processing Razorpay...
                                        </>
                                    ) : currentPlan === "agency" ? (
                                        "Current Active Plan"
                                    ) : (
                                        <>
                                            <Crown className="size-4" /> Upgrade to Agency Plan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: CREDIT PACKS */}
                {activeTab === "credits" && (
                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                            <div>
                                <span className="font-semibold text-slate-800 block">
                                    💡 No Monthly Commitments
                                </span>
                                Top-up AI tokens whenever you need extra generations. Credits never expire!
                            </div>
                            <Coins className="size-7 text-amber-500 shrink-0 ml-3" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* 100 Credits */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Starter Pack</div>
                                    <div className="text-2xl font-extrabold text-slate-900 mt-1">₹99</div>
                                    <div className="text-xs text-red-600 font-semibold mt-1">+100 AI Credits</div>
                                    <p className="text-[11px] text-slate-400 mt-2">
                                        Ideal for testing and occasional generation bursts.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSubscribe("credit_pack_100")}
                                    disabled={!!isProcessing}
                                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                                >
                                    {isProcessing === "credit_pack_100" ? "Opening..." : "Buy 100 Credits"}
                                </button>
                            </div>

                            {/* 500 Credits */}
                            <div className="p-5 bg-red-50/50 rounded-2xl border-2 border-red-500 shadow-sm flex flex-col justify-between space-y-4 relative">
                                <span className="absolute -top-2.5 right-4 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Popular
                                </span>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Growth Pack</div>
                                    <div className="text-2xl font-extrabold text-slate-900 mt-1">₹399</div>
                                    <div className="text-xs text-red-600 font-bold mt-1">+500 AI Credits</div>
                                    <p className="text-[11px] text-slate-500 mt-2">
                                        High volume for active creators and weekly campaigns.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSubscribe("credit_pack_500")}
                                    disabled={!!isProcessing}
                                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                                >
                                    {isProcessing === "credit_pack_500" ? "Opening..." : "Buy 500 Credits"}
                                </button>
                            </div>

                            {/* 1500 Credits */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Pro Power Pack</div>
                                    <div className="text-2xl font-extrabold text-slate-900 mt-1">₹999</div>
                                    <div className="text-xs text-indigo-600 font-bold mt-1">+1,500 AI Credits</div>
                                    <p className="text-[11px] text-slate-400 mt-2">
                                        Maximum value for power users & team automation.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSubscribe("credit_pack_1500")}
                                    disabled={!!isProcessing}
                                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
                                >
                                    {isProcessing === "credit_pack_1500" ? "Opening..." : "Buy 1,500 Credits"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer security note */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>256-bit Encrypted Payments powered by Razorpay. 100% Secure.</span>
                </div>
            </div>
        </div>
    );
};

export default UpgradePlanModal;
