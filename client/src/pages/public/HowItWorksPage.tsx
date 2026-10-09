import { Link } from "react-router-dom";
import { Link2, Sparkles, CalendarClock, Send, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
    const steps = [
        {
            number: "01",
            icon: Link2,
            title: "Connect Your Social Accounts",
            desc: "Securely link your LinkedIn, Instagram, Facebook, and Twitter/X channels in one click. Manage credentials safely in your personal settings.",
            badge: "Fast Setup",
        },
        {
            number: "02",
            icon: Sparkles,
            title: "Craft with AI Superpowers",
            desc: "Type a short idea or prompt. Let Google Gemini generate catchy, platform-optimized copy while Leonardo.ai designs attention-grabbing visuals.",
            badge: "AI Generation",
        },
        {
            number: "03",
            icon: CalendarClock,
            title: "Schedule & Set Dates",
            desc: "Select your target posting date and time. Choose whether to publish immediately or queue it for peak audience engagement hours.",
            badge: "Smart Timing",
        },
        {
            number: "04",
            icon: Send,
            title: "Sit Back & Let Autopilot Deliver",
            desc: "Our server background scheduler automatically publishes the post at the exact second, updates logs, and tracks delivery status.",
            badge: "100% Automated",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Simple 4-Step Workflow
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-6">
                    How Scheduler Works
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    From idea to published post across all your social channels in under 60 seconds.
                </p>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-12 mb-20">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-4 shrink-0">
                            <span className="text-4xl font-serif font-bold text-red-500/80">{step.number}</span>
                            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                                <step.icon className="size-7" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                    {step.badge}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Benefits Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 text-center">
                <h2 className="text-3xl font-serif font-medium mb-4">Save 10+ hours every single week</h2>
                <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                    Stop switching between multiple browser tabs and third-party tools. Unify your social media workflow today.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-slate-300">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" /> No credit card required
                    </span>
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" /> Instant account linking
                    </span>
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" /> Cancel anytime
                    </span>
                </div>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-red-500/20"
                >
                    Get Started Free <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
