import { ShieldCheck, KeyRound, Lock, Server, CheckCircle2, FileCode } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function SecurityPage() {
    const pillars = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            desc: "All network traffic is encrypted using modern TLS 1.3 in transit. Sensitive API tokens and credentials are encrypted using AES-256 at rest.",
        },
        {
            icon: KeyRound,
            title: "Secure API Key Vault",
            desc: "Custom AI API keys (Gemini, Leonardo) are stored in secure, salted vaults and never exposed to the client-side JavaScript environment.",
        },
        {
            icon: Server,
            title: "Isolated Execution Queues",
            desc: "Background jobs for automated publishing run on isolated worker nodes with bounded permissions and comprehensive audit logging.",
        },
        {
            icon: ShieldCheck,
            title: "OAuth 2.0 Delegated Auth",
            desc: "We use official OAuth authentication workflows so we never store or handle your raw social media passwords directly.",
        },
    ];

    return (
        <div className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
            <SEO
                title="Security & Data Protection Standards"
                description="Explore the enterprise-grade security architecture protecting your tokens, OAuth sessions, and media assets in Social Media Scheduler."
                keywords="security standards, oauth encryption, api key protection"
            />
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Security & Trust
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif font-medium text-slate-900 mt-4 mb-4">
                    Enterprise-Grade Security by Design
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    Protecting your brand, credentials, and content is our highest engineering priority.
                </p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {pillars.map((item, idx) => (
                    <div key={idx} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                            <item.icon className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-10 mb-16">
                <h2 className="text-2xl font-serif font-medium text-slate-900 mb-6">Our Continuous Security Commitments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        "Continuous automated vulnerability scanning",
                        "Role-based access controls for backend resources",
                        "Zero third-party telemetry tracker injection",
                        "Daily encrypted database backups",
                        "Instant account revoking & token termination",
                        "Strict rate limiting against brute-force attacks",
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Responsible Disclosure */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center">
                <FileCode className="size-8 text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Vulnerability Disclosure & Bug Bounty</h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto mb-4">
                    If you discover a security vulnerability or bug, please disclose it responsibly to our security response team.
                </p>
                <a
                    href="mailto:asavant151@gmail.com?subject=Security Vulnerability Report"
                    className="text-xs font-semibold text-red-500 hover:underline"
                >
                    Report via Email (asavant151@gmail.com)
                </a>
            </div>
        </div>
    );
}
