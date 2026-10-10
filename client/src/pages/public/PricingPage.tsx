import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, HelpCircle, Sparkles, Crown, Zap, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UpgradePlanModal from "../../components/UpgradePlanModal";

export default function PricingPage() {
    const { isAuthenticated, plan: userPlan } = useAuth();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedHighlight, setSelectedHighlight] = useState<"pro" | "agency">("pro");

    const pricingPlans = [
        {
            key: "free",
            name: "Free Starter",
            priceMonthly: "₹0",
            priceYearly: "₹0",
            period: "Forever Free",
            description: "Explore the platform, connect 1 account, and draft AI posts.",
            features: [
                "1 Social Media Account Connected",
                "50 Free Starter AI Credits",
                "AI Post Composer (Gemini 2.5 Flash)",
                "Standard Post Scheduler & Calendar",
                "BYOK Unlimited Gemini Key Support",
                "Basic Post Analytics & History",
            ],
            cta: "Get Started Free",
            highlight: false,
        },
        {
            key: "pro",
            name: "Pro Creator",
            priceMonthly: "₹499",
            priceYearly: "₹4,999",
            period: billingCycle === "monthly" ? "/month" : "/year",
            savingsNote: billingCycle === "yearly" ? "Save ₹989 with annual billing" : "Billed monthly, cancel anytime",
            description: "For creators & businesses wanting full automated multi-channel growth.",
            features: [
                "Connect up to 5 Social Accounts",
                "500 Monthly AI Credits or Unlimited BYOK",
                "🔄 1-Click Multi-Format Content Repurposer",
                "📅 30-Day Campaign Autopilot Planner",
                "🕵️ Competitor Viral Post Decoder",
                "Leonardo.ai Visual Studio Graphics",
                "Priority Publishing Queue",
            ],
            cta: "Upgrade to Pro",
            highlight: true,
        },
        {
            key: "agency",
            name: "Agency / Business",
            priceMonthly: "₹1,499",
            priceYearly: "₹14,999",
            period: billingCycle === "monthly" ? "/month" : "/year",
            savingsNote: billingCycle === "yearly" ? "Save ₹2,989 with annual billing" : "Billed monthly, cancel anytime",
            description: "Built for marketing agencies and brands managing multi-account campaigns.",
            features: [
                "Unlimited Social Media Accounts",
                "2,000 Monthly AI Credits + Unlimited BYOK",
                "🎁 'Comment & Get' Lead Magnet Funnel Studio",
                "Live Comment Trigger Simulator Studio",
                "👥 Captured Hot Leads CRM & Status Tracking",
                "📥 1-Click Leads CSV Export",
                "Everything in Pro Tier Included",
                "Dedicated WhatsApp / Email Priority Support",
            ],
            cta: "Upgrade to Agency",
            highlight: false,
            badge: "All Features Unlocked",
        },
    ];

    const faqs = [
        {
            q: "How does Razorpay payment work?",
            a: "We support instant, secure payments via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking through Razorpay with 256-bit encryption.",
        },
        {
            q: "What is the Bring Your Own Key (BYOK) benefit?",
            a: "If you have your own free Google Gemini API key, you can enter it in Settings -> API Keys and enjoy Unlimited AI generations completely free forever without consuming credits!",
        },
        {
            q: "Can I upgrade or downgrade my plan at any time?",
            a: "Yes, you can upgrade your plan instantly. Your new plan features and expanded quotas activate immediately upon payment verification.",
        },
        {
            q: "What happens when my 50 free credits run out?",
            a: "You can either top-up credits (starting at ₹99 for 100 credits), upgrade to Pro/Agency, or plug in your own free Gemini API key to keep generating for free.",
        },
    ];

    const handlePlanClick = (planKey: string) => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        if (planKey === "pro" || planKey === "agency") {
            setSelectedHighlight(planKey as "pro" | "agency");
            setIsUpgradeModalOpen(true);
        } else {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Transparent INR Pricing with Razorpay
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    Simple plans tailored to your growth
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    No hidden fees, no lock-ins. Get started for free or supercharge your social presence with AI automation.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 mt-8">
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
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
                {pricingPlans.map((plan) => {
                    const isCurrent = userPlan === plan.key;
                    const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

                    return (
                        <div
                            key={plan.name}
                            className={`rounded-3xl border p-8 flex flex-col justify-between relative transition-all duration-300 ${
                                plan.highlight
                                    ? "bg-red-600 text-white border-red-500 shadow-xl ring-2 ring-red-500/30"
                                    : plan.key === "agency"
                                    ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-800 shadow-lg"
                                    : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm"
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide flex items-center gap-1 shadow-sm">
                                    <Sparkles className="size-3 text-amber-400" /> Most Popular
                                </div>
                            )}

                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-bold px-4 py-1 rounded-full tracking-wide shadow-sm">
                                    <Crown className="size-3 inline mr-1" /> {plan.badge}
                                </div>
                            )}

                            <div>
                                <div
                                    className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                                        plan.highlight
                                            ? "text-red-100"
                                            : plan.key === "agency"
                                            ? "text-amber-400"
                                            : "text-red-600"
                                    }`}
                                >
                                    {plan.name}
                                </div>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                                    <span
                                        className={`text-xs ${
                                            plan.highlight
                                                ? "text-red-100"
                                                : plan.key === "agency"
                                                ? "text-slate-400"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {plan.period}
                                    </span>
                                </div>
                                {plan.savingsNote && (
                                    <p
                                        className={`text-[11px] mb-4 ${
                                            plan.highlight
                                                ? "text-red-100"
                                                : plan.key === "agency"
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {plan.savingsNote}
                                    </p>
                                )}
                                <p
                                    className={`text-xs leading-relaxed mb-6 ${
                                        plan.highlight
                                            ? "text-red-50"
                                            : plan.key === "agency"
                                            ? "text-slate-300"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {plan.description}
                                </p>

                                <div
                                    className={`h-px w-full my-6 ${
                                        plan.highlight
                                            ? "bg-red-400/50"
                                            : plan.key === "agency"
                                            ? "bg-slate-800"
                                            : "bg-slate-100"
                                    }`}
                                />

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                                            <div
                                                className={`size-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                    plan.highlight
                                                        ? "bg-white/20 text-white"
                                                        : plan.key === "agency"
                                                        ? "bg-amber-400/20 text-amber-400"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                <CheckIcon className="w-3 h-3" />
                                            </div>
                                            <span
                                                className={
                                                    plan.highlight
                                                        ? "text-white font-medium"
                                                        : plan.key === "agency"
                                                        ? "text-slate-200"
                                                        : "text-slate-700 font-medium"
                                                }
                                            >
                                                {f}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {isAuthenticated ? (
                                <button
                                    onClick={() => handlePlanClick(plan.key)}
                                    disabled={isCurrent}
                                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                                        isCurrent
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                                            : plan.highlight
                                            ? "bg-white text-red-600 hover:bg-rose-50"
                                            : plan.key === "agency"
                                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {isCurrent ? (
                                        "Current Plan"
                                    ) : (
                                        <>
                                            <Zap className="size-4" /> {plan.cta}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`w-full text-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md block ${
                                        plan.highlight
                                            ? "bg-white text-red-600 hover:bg-rose-50"
                                            : plan.key === "agency"
                                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mb-16">
                <ShieldCheck className="size-5 text-emerald-600" />
                <span>Instant activation via Razorpay UPI & Cards. Cancel or upgrade anytime with 1 click.</span>
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        <HelpCircle className="size-4" /> Got Questions?
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-2">{faq.q}</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upgrade Modal */}
            <UpgradePlanModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                highlightPlan={selectedHighlight}
            />
        </div>
    );
}
