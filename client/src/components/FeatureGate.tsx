import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Sparkles, CheckCircle2, Zap, Crown } from "lucide-react";
import UpgradePlanModal from "./UpgradePlanModal";

interface FeatureGateProps {
    requiredPlan: "pro" | "agency";
    featureName: string;
    featureDescription: string;
    benefits: string[];
    children: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
    requiredPlan,
    featureName,
    featureDescription,
    benefits,
    children,
}) => {
    const { plan } = useAuth();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const hasAccess =
        plan === "agency" || (requiredPlan === "pro" && plan === "pro");

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xs p-6 sm:p-10 text-center">
            {/* Background Blur & Illustration */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-white to-red-50/30 backdrop-blur-md pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto space-y-5">
                {/* Lock Badge */}
                <div className="size-16 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
                    <Lock className="size-8" />
                </div>

                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                        {requiredPlan === "agency" ? (
                            <>
                                <Crown className="size-3.5 text-amber-600" /> Agency Plan Exclusive
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-3.5" /> Pro Creator Feature
                            </>
                        )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {featureName} is Locked
                    </h2>
                    <p className="text-sm text-slate-500">
                        {featureDescription}
                    </p>
                </div>

                {/* Benefits List */}
                <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-left space-y-2.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        What you unlock with {requiredPlan === "agency" ? "Agency" : "Pro"}:
                    </div>
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                            <span>{benefit}</span>
                        </div>
                    ))}
                </div>

                {/* Upgrade Button */}
                <div className="pt-2">
                    <button
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                        <Zap className="size-4" />
                        Upgrade to {requiredPlan === "agency" ? "Agency" : "Pro"} Plan with Razorpay
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                        Starts at just {requiredPlan === "agency" ? "₹1,499/mo" : "₹499/mo"}. Instant 1-click activation.
                    </p>
                </div>
            </div>

            {/* Modal */}
            <UpgradePlanModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                highlightPlan={requiredPlan}
            />
        </div>
    );
};

export default FeatureGate;
