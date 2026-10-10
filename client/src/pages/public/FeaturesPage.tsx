import { Link } from "react-router-dom";
import { Sparkles, Calendar, Layers, Image, ShieldCheck, Zap, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function FeaturesPage() {
    const features = [
        {
            icon: Sparkles,
            title: "AI Post Composer",
            desc: "Generate contextual, engaging post captions in seconds with Google Gemini AI. Choose from multiple tones (Professional, Playful, Persuasive) tailored to your brand voice.",
            color: "bg-red-50 text-red-500",
        },
        {
            icon: Image,
            title: "AI Visual Studio",
            desc: "Create bespoke, photorealistic and artistic visuals using Leonardo.ai integration. Never worry about royalty-free stock assets again.",
            color: "bg-amber-50 text-amber-500",
        },
        {
            icon: Calendar,
            title: "Multi-Platform Scheduler",
            desc: "Queue your posts across LinkedIn, X (Twitter), Facebook, and Instagram with customizable publishing slots. Set it once and let the autopilot work.",
            color: "bg-blue-50 text-blue-500",
        },
        {
            icon: Layers,
            title: "Unified Media Manager",
            desc: "Cloudinary-backed cloud storage to organize, preview, and re-share your previous creatives and generated assets with zero storage footprint.",
            color: "bg-emerald-50 text-emerald-500",
        },
        {
            icon: ShieldCheck,
            title: "Secure API & Account Vault",
            desc: "Bring your own API keys with enterprise-level encryption and OAuth integrations for safe, uninterrupted social connections.",
            color: "bg-purple-50 text-purple-500",
        },
        {
            icon: BarChart3,
            title: "Post Tracking & Logs",
            desc: "Real-time delivery status, error logs, and execution notifications to make sure your audience never misses an update.",
            color: "bg-indigo-50 text-indigo-500",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-6xl mx-auto">
            <SEO
                title="Features & Capabilities"
                description="Explore all features of Social Media Scheduler: AI Content Generation, Visual Studio, Multi-Platform Auto Scheduling, Competitor Decoder, and Analytics."
                keywords="social media features, ai content scheduler features, auto posting tool, multi platform social scheduler"
            />
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Capabilities & Features
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-6">
                    Everything you need to scale your social reach
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Explore the powerful suite of AI generation, cross-platform publishing, and scheduling tools built directly into Scheduler.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${item.color}`}>
                                <item.icon className="size-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Deep Dive Section */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-12 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Built for Growth</span>
                        <h2 className="text-3xl font-serif font-medium text-slate-900 mt-2 mb-4">
                            Spend less time writing, more time scaling
                        </h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Writing high-converting social media posts daily takes hours. Our built-in Gemini AI assistant understands your target audience, formats hashtags, and writes compelling hooks automatically.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {["Custom tone customization (Professional, Casual, Viral, Educational)", "Platform-tailored character limits & hashtag optimization", "Instant regeneration & prompt tuning"].map((point, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-all shadow-sm hover:shadow-red-200"
                        >
                            Try AI Composer Now <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-semibold text-slate-500 uppercase">AI Post Prompt</span>
                            <span className="text-xs text-red-500 font-medium">Gemini 1.5 Pro</span>
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            "Write a LinkedIn announcement post about our new AI-powered product launch with emojis and action items."
                        </p>
                        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed">
                            🚀 Excited to announce our new milestone...
                            <br />
                            💡 Tap below to test the early beta!
                            <br />
                            #AI #Automation #ProductLaunch
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center">
                <h3 className="text-2xl font-serif font-medium text-slate-900 mb-4">Ready to automate your social schedule?</h3>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all"
                >
                    Get Started Free <Zap className="size-4 text-yellow-400" />
                </Link>
            </div>
        </div>
    );
}
