import { Link } from "react-router-dom";
import { Sparkles, Users, Target, Heart, ArrowRight } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: "Simplicity First",
            desc: "We build intuitive tools that eliminate complexity so you can focus on building meaningful connections with your audience.",
        },
        {
            icon: Sparkles,
            title: "Responsible AI",
            desc: "We harness AI as a creative partner that elevates human expression rather than replacing genuine voice.",
        },
        {
            icon: Users,
            title: "Creator Centric",
            desc: "Every feature we develop is inspired by real creators, digital marketers, and growing businesses worldwide.",
        },
        {
            icon: Heart,
            title: "Transparency & Trust",
            desc: "Your data privacy and account security are paramount. We practice absolute honesty in pricing and policies.",
        },
    ];

    const team = [
        {
            name: "Savan",
            role: "Founder & Lead Architect",
            bio: "Passionate full-stack developer dedicated to building AI-driven automation tools that empower modern creators.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        },
        {
            name: "Alex Morgan",
            role: "Product & Growth Lead",
            bio: "Specialist in user experience and digital marketing strategies for fast-growing SaaS startups.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        },
        {
            name: "Priya Sharma",
            role: "AI & Integrations Engineer",
            bio: "Focuses on fine-tuning LLM pipelines, prompt engineering, and real-time social API webhooks.",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
            <SEO
                title="About Us - Empowering Modern Creators"
                description="Discover the story and mission behind Social Media Scheduler. We empower creators and businesses to streamline content creation and amplify organic growth."
                keywords="about social media scheduler, creator automation team, social media tech"
            />
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Our Story & Mission
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-6">
                    Empowering creators through AI-driven automation
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Scheduler was born out of a simple belief: managing social media shouldn't feel like a full-time, repetitive chore.
                </p>
            </div>

            {/* Mission Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-12 mb-20">
                <h2 className="text-2xl font-serif font-medium text-slate-900 mb-4">Why we built Scheduler</h2>
                <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                    <p>
                        In today's fast-paced digital world, maintaining a vibrant presence across multiple social networks requires constant ideation, copywriting, graphic design, and precise scheduling. For individual creators and small marketing teams, this quickly leads to burnout.
                    </p>
                    <p>
                        By uniting Google Gemini's contextual natural language capabilities and Leonardo.ai's creative generative vision with robust scheduling automation, Scheduler gives you a 24/7 AI marketing team right inside your browser.
                    </p>
                </div>
            </div>

            {/* Core Values */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-medium text-slate-900">Our Core Values</h2>
                    <p className="text-slate-500 text-sm mt-2">The principles that guide our development every day</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                                <v.icon className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg mb-1">{v.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-medium text-slate-900">Meet the Team</h2>
                    <p className="text-slate-500 text-sm mt-2">Builders passionate about technology and automation</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {team.map((m, i) => (
                        <div key={i} className="text-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                            <img
                                src={m.avatar}
                                alt={m.name}
                                className="size-24 rounded-full mx-auto object-cover mb-4 ring-4 ring-slate-50"
                            />
                            <h4 className="font-semibold text-slate-900 text-base">{m.name}</h4>
                            <p className="text-xs text-red-500 font-medium mb-3">{m.role}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{m.bio}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center">
                <h2 className="text-3xl font-serif font-medium mb-4">Join our growing community</h2>
                <p className="text-slate-300 max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                    Experience the future of content planning and social publishing with Scheduler today.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3.5 rounded-full transition-all shadow-md"
                >
                    Get Started Free <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
