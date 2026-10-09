import { Link } from "react-router-dom";
import { CheckIcon, HelpCircle } from "lucide-react";

export default function PricingPage() {
    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            period: "",
            description: "Perfect for solo creators just starting their social media journey.",
            features: [
                "2 social accounts connected",
                "10 scheduled posts / month",
                "Google Gemini AI captions (15 credits)",
                "Basic post logs & history",
                "Community support",
            ],
            cta: "Get Started Free",
            highlight: false,
        },
        {
            name: "Pro",
            price: "$29",
            period: "/month",
            description: "Ideal for active creators & businesses wanting full automation.",
            features: [
                "Unlimited social accounts",
                "Unlimited automated scheduling",
                "Google Gemini AI (500 credits / mo)",
                "Leonardo.ai HD image generation",
                "Multi-platform one-click sync",
                "Priority email & chat support",
            ],
            cta: "Start 14-Day Free Trial",
            highlight: true,
        },
        {
            name: "Agency",
            price: "$79",
            period: "/month",
            description: "Built for marketing agencies managing multiple brands & teams.",
            features: [
                "Everything in Pro tier",
                "Up to 10 team seats & workspaces",
                "Unlimited AI text & image generation",
                "Custom brand voice & persona presets",
                "Dedicated account manager",
                "API access & webhook integration",
            ],
            cta: "Contact Sales",
            highlight: false,
        },
    ];

    const faqs = [
        {
            q: "Can I change my plan later?",
            a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your account settings.",
        },
        {
            q: "Do I need to enter a credit card to try?",
            a: "No! You can get started with our free tier immediately without providing any credit card information.",
        },
        {
            q: "Which social media platforms are supported?",
            a: "We currently support LinkedIn, Instagram, Facebook Pages & Groups, and X (formerly Twitter). More platforms are added regularly.",
        },
        {
            q: "Can I use my own Gemini or Leonardo AI API keys?",
            a: "Yes! In your Settings page, you can easily plug in your custom API keys for complete control and unlimited usage.",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Transparent Pricing
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-6">
                    Simple plans tailored to your growth
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    No hidden fees, no tricky lock-ins. Pick the tier that best fits your workflow.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
                {pricingPlans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-3xl border p-8 flex flex-col justify-between relative transition-all duration-300 ${
                            plan.highlight
                                ? "bg-red-500 text-white border-red-400 shadow-2xl shadow-red-200"
                                : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                                Most Popular
                            </div>
                        )}
                        <div>
                            <div className={`text-sm font-semibold mb-2 ${plan.highlight ? "text-red-100" : "text-red-500"}`}>
                                {plan.name}
                            </div>
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-4xl sm:text-5xl font-bold tracking-tight">{plan.price}</span>
                                <span className={`text-sm ${plan.highlight ? "text-red-100" : "text-slate-400"}`}>
                                    {plan.period}
                                </span>
                            </div>
                            <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? "text-red-100" : "text-slate-500"}`}>
                                {plan.description}
                            </p>

                            <div className={`h-px w-full my-6 ${plan.highlight ? "bg-red-400" : "bg-slate-100"}`} />

                            <ul className="space-y-3.5 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm">
                                        <div
                                            className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                plan.highlight ? "bg-red-400 text-white" : "bg-red-50 text-red-500"
                                            }`}
                                        >
                                            <CheckIcon className="w-3 h-3" />
                                        </div>
                                        <span className={plan.highlight ? "text-red-50" : "text-slate-700"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            to="/login"
                            className={`w-full text-center font-semibold text-sm px-6 py-3.5 rounded-full transition-all ${
                                plan.highlight
                                    ? "bg-white text-red-600 hover:bg-red-50 shadow-md"
                                    : "bg-red-500 text-white hover:bg-red-600 shadow-sm"
                            }`}
                        >
                            {plan.cta}
                        </Link>
                    </div>
                ))}
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        <HelpCircle className="size-4" /> Got Questions?
                    </div>
                    <h2 className="text-3xl font-serif font-medium text-slate-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 text-base mb-2">{faq.q}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
