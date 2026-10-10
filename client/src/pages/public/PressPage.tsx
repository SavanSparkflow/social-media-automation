import { Download, Mail, ExternalLink, Newspaper } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function PressPage() {
    const pressReleases = [
        {
            date: "October 2026",
            outlet: "Tech Trends Daily",
            title: "Scheduler announces multi-model AI workflows for next-generation social automation",
            link: "#",
        },
        {
            date: "September 2026",
            outlet: "SaaS Insider",
            title: "How Scheduler helps digital agencies save 15+ hours weekly with Gemini AI integration",
            link: "#",
        },
        {
            date: "August 2026",
            outlet: "Creator Economy Hub",
            title: "Top AI automation tools every content creator should test in 2026",
            link: "#",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
            <SEO
                title="Press & Brand Media Kit"
                description="Find official brand assets, logos, media kit, and press release coverage for Social Media Scheduler."
                keywords="press kit, media assets, news releases social media scheduler"
            />
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Press & Media Kit
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    News & Brand Resources
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                    Everything you need to write about Scheduler: official brand assets, company bio, and recent press announcements.
                </p>
            </div>

            {/* Quick Facts / Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center">
                    <span className="text-3xl font-serif font-bold text-slate-900">4+</span>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wide">Supported Networks</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center">
                    <span className="text-3xl font-serif font-bold text-slate-900">99.9%</span>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wide">Uptime Scheduler</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center">
                    <span className="text-3xl font-serif font-bold text-slate-900">2x</span>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wide">AI Generation Engines</p>
                </div>
            </div>

            {/* Media Kit Download Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 mb-16 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-2">Download Media Kit</h2>
                    <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                        Includes official high-res logos (SVG & PNG), product UI screenshots, brand guidelines, and executive headshots.
                    </p>
                </div>
                <a
                    href="/logo.svg"
                    download="Scheduler-Logo.svg"
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-6 py-3 rounded-full transition-all shrink-0 shadow-sm"
                >
                    <Download className="size-4" /> Download Assets
                </a>
            </div>

            {/* Press Coverage */}
            <div className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                    <Newspaper className="size-5 text-red-500" />
                    <h2 className="text-2xl font-serif font-medium text-slate-900">Recent Coverage</h2>
                </div>

                <div className="space-y-4">
                    {pressReleases.map((item, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                        >
                            <div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-1">
                                    <span className="font-semibold text-slate-700">{item.outlet}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                            </div>
                            <span className="text-xs font-semibold text-red-500 inline-flex items-center gap-1 cursor-pointer hover:underline shrink-0">
                                Read Article <ExternalLink className="size-3" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Press Contact */}
            <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-serif font-semibold mb-1">Press & Media Inquiries</h3>
                    <p className="text-xs text-slate-300">Need commentary, interview availability, or exclusive feature access?</p>
                </div>
                <a
                    href="mailto:asavant151@gmail.com?subject=Press Inquiry: Scheduler"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold px-5 py-3 rounded-full transition-all shrink-0"
                >
                    <Mail className="size-3.5" /> asavant151@gmail.com
                </a>
            </div>
        </div>
    );
}
