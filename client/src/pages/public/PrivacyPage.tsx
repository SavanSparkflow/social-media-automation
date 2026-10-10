import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function PrivacyPage() {
    return (
        <div className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
            <SEO
                title="Privacy Policy"
                description="Read our Privacy Policy to understand how Social Media Scheduler handles your account data, credentials, and API connections securely."
                keywords="privacy policy, data privacy, social media scheduler security"
            />
            {/* Header */}
            <div className="mb-12 border-b border-slate-100 pb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Legal & Compliance
                </span>
                <h1 className="text-4xl font-serif font-medium text-slate-900 mt-4 mb-2">Privacy Policy</h1>
                <p className="text-sm text-slate-500">Last updated: October 2026</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Eye className="size-5 text-red-500" /> 1. Information We Collect
                    </h2>
                    <p className="text-slate-600 mb-3">
                        When you register for and use Scheduler, we collect the following types of information:
                    </p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                        <li><strong>Account Information:</strong> Name, email address, password hash, and profile details.</li>
                        <li><strong>Social Media Credentials & Tokens:</strong> Encrypted access tokens required to publish posts on your connected accounts (e.g., LinkedIn, Instagram, Facebook, Twitter).</li>
                        <li><strong>Generated Content:</strong> Post drafts, captions, AI generation prompts, and uploaded image metadata.</li>
                        <li><strong>Usage Data:</strong> Technical logs, IP addresses, browser types, and interaction telemetry to maintain service reliability.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Lock className="size-5 text-red-500" /> 2. How We Use Your Information
                    </h2>
                    <p className="text-slate-600 mb-3">We use your data strictly to provide and improve the services, including:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                        <li>Executing scheduled post delivery to your linked social platforms.</li>
                        <li>Processing AI text generation with Gemini AI and image rendering with Leonardo.ai.</li>
                        <li>Securing your account against unauthorized access and verifying sessions.</li>
                        <li>Sending important transactional updates, service notices, and support responses.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <ShieldCheck className="size-5 text-red-500" /> 3. Data Protection & Security
                    </h2>
                    <p className="text-slate-600">
                        We implement industry-standard encryption protocols (SSL/TLS in transit and AES-256 at rest) for all sensitive information, including API keys and social media authentication tokens. We will never sell, rent, or trade your personal data to third parties for advertising purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <FileText className="size-5 text-red-500" /> 4. Your Rights & Deletion
                    </h2>
                    <p className="text-slate-600">
                        You hold the full right to export, modify, or permanently delete your account data at any time from your settings dashboard. Upon account closure, all associated social tokens and generated post histories will be removed from our active database.
                    </p>
                </section>

                <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-base mb-1">Questions or Privacy Concerns?</h3>
                    <p className="text-xs text-slate-600">
                        For any privacy-related questions, please contact our Data Protection team at:{" "}
                        <a href="mailto:asavant151@gmail.com" className="text-red-500 font-semibold hover:underline">
                            asavant151@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
