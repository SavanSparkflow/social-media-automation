import { MapPin, DollarSign, Clock, Sparkles, Heart, Rocket, Coffee, ArrowRight } from "lucide-react";

export default function CareersPage() {
    const perks = [
        { icon: Rocket, title: "Remote-First", desc: "Work from anywhere in the world with flexible hours." },
        { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health benefits & wellness stipend." },
        { icon: Sparkles, title: "AI Learning Budget", desc: "Annual allowance for courses, conferences, & tool subscriptions." },
        { icon: Coffee, title: "Flexible Time Off", desc: "Take the time you need to recharge and maintain balance." },
    ];

    const jobs = [
        {
            title: "Senior Full-Stack Engineer (React & Node.js)",
            department: "Engineering",
            location: "Remote (Global)",
            type: "Full-Time",
            salary: "$90k - $120k",
        },
        {
            title: "AI / ML Integrations Specialist",
            department: "Engineering",
            location: "Remote",
            type: "Full-Time",
            salary: "$100k - $130k",
        },
        {
            title: "Product Marketing Manager",
            department: "Marketing",
            location: "Remote",
            type: "Full-Time",
            salary: "$75k - $95k",
        },
        {
            title: "Customer Success & Community Lead",
            department: "Operations",
            location: "Remote",
            type: "Full-Time",
            salary: "$55k - $70k",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Join Our Team
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    Build the future of social automation
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                    We are a passionate, remote-first team building state-of-the-art AI tooling for millions of creators worldwide.
                </p>
            </div>

            {/* Perks */}
            <div className="mb-20">
                <h2 className="text-2xl font-serif font-medium text-slate-900 mb-8 text-center">Why You'll Love Working Here</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {perks.map((p, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm text-center">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
                                <p.icon className="size-6" />
                            </div>
                            <h3 className="font-semibold text-slate-900 text-base mb-1">{p.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Open Positions */}
            <div className="mb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-medium text-slate-900">Open Positions</h2>
                        <p className="text-sm text-slate-500">Find your next role and apply in minutes</p>
                    </div>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full self-start">
                        {jobs.length} open roles
                    </span>
                </div>

                <div className="space-y-4">
                    {jobs.map((job, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">{job.department}</span>
                                <h3 className="text-lg font-semibold text-slate-900 mt-0.5 mb-2">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="size-3.5" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3.5" /> {job.type}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-slate-700">
                                        <DollarSign className="size-3.5" /> {job.salary}
                                    </span>
                                </div>
                            </div>

                            <a
                                href="mailto:asavant151@gmail.com?subject=Job Application: "
                                className="inline-flex items-center justify-center gap-1 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full transition-all shrink-0"
                            >
                                Apply Now <ArrowRight className="size-3.5" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer note */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-1">Don't see a position that matches your profile?</h3>
                <p className="text-xs text-slate-500 mb-4">We are always open to talented individuals. Send your resume and thoughts directly to our founder.</p>
                <a
                    href="mailto:asavant151@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
                >
                    Contact Recruitment (asavant151@gmail.com)
                </a>
            </div>
        </div>
    );
}
