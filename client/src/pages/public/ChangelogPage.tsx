import { Calendar, Tag, CheckCircle2 } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function ChangelogPage() {
    const releases = [
        {
            version: "v2.2.0",
            date: "October 2026",
            tag: "Latest Release",
            title: "Multi-Platform AI Sync & Leonardo.ai Integration",
            highlights: [
                "Integrated Leonardo.ai for generating studio-grade AI visuals directly inside the post editor.",
                "Added direct multi-channel publishing to Instagram Reels and Facebook Pages in parallel.",
                "Optimized backend node cron job queues for zero latency post dispatching.",
                "Redesigned Settings page for custom API key encryption and key rotation.",
            ],
        },
        {
            version: "v2.0.0",
            date: "September 2026",
            tag: "Major Upgrade",
            title: "Google Gemini 1.5 AI Composer Engine",
            highlights: [
                "Upgraded text generation pipeline to Google Gemini for faster response times and improved prompt understanding.",
                "Added custom tone selectors (Professional, Viral, Engaging, Storytelling).",
                "Brand new responsive dashboard with React 19 and Tailwind CSS.",
                "Cloudinary integration for automatic media CDN uploads.",
            ],
        },
        {
            version: "v1.4.0",
            date: "August 2026",
            tag: "Feature Update",
            title: "Smart Post Scheduler & Calendar View",
            highlights: [
                "Introduced precise date and time scheduling with time-zone adjustments.",
                "Added instant post history filters and status indicators (Queued, Published, Failed).",
                "Secured authentication tokens and user session persistence.",
            ],
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
            <SEO
                title="Changelog & Product Releases"
                description="Stay updated with new features, AI model integrations, and performance improvements in Social Media Scheduler."
                keywords="product changelog, new features social scheduler, release notes"
            />
            {/* Header */}
            <div className="text-center mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Product Updates
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    Changelog & Releases
                </h1>
                <p className="text-base text-slate-600">
                    Keep track of new features, performance updates, and continuous improvements to Scheduler.
                </p>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-slate-100 pl-6 sm:pl-8 space-y-12 ml-4">
                {releases.map((rel, idx) => (
                    <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-red-500 shadow-sm" />

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="font-mono font-bold text-slate-900 text-lg">{rel.version}</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                    <Calendar className="size-3" /> {rel.date}
                                </span>
                                {rel.tag && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                                        <Tag className="size-3" /> {rel.tag}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold text-slate-800 mb-4">{rel.title}</h3>

                            <ul className="space-y-2.5">
                                {rel.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
