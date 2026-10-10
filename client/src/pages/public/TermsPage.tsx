import { Scale, CheckCircle2, AlertTriangle, FileCheck } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function TermsPage() {
    return (
        <div className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
            <SEO
                title="Terms of Service"
                description="Read our Terms of Service outlining user agreements, acceptable use, and service commitments for Social Media Scheduler."
                keywords="terms of service, legal terms, terms and conditions"
            />
            {/* Header */}
            <div className="mb-12 border-b border-slate-100 pb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Terms of Agreement
                </span>
                <h1 className="text-4xl font-serif font-medium text-slate-900 mt-4 mb-2">Terms of Service</h1>
                <p className="text-sm text-slate-500">Effective Date: October 2026</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Scale className="size-5 text-red-500" /> 1. Acceptance of Terms
                    </h2>
                    <p className="text-slate-600">
                        By registering, accessing, or using Scheduler, you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of an entity or agency, you represent that you have the authority to bind such entity.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <FileCheck className="size-5 text-red-500" /> 2. Fair Use & Account Responsibilities
                    </h2>
                    <p className="text-slate-600 mb-3">You agree to use our automation services ethically and responsibly:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
                        <li>You must not post spam, hate speech, unlawful materials, or infringing intellectual property.</li>
                        <li>You must adhere to the Developer Guidelines and Terms of Use of each third-party platform (LinkedIn, Instagram, Meta/Facebook, X).</li>
                        <li>You are solely responsible for maintaining the confidentiality of your credentials and API keys.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-red-500" /> 3. Content Ownership & AI Output
                    </h2>
                    <p className="text-slate-600">
                        You retain full ownership of all prompts, text copy, images, and media that you upload or generate through the platform. Scheduler does not claim intellectual property rights over user-generated creative outputs.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="size-5 text-red-500" /> 4. Disclaimers & Limitation of Liability
                    </h2>
                    <p className="text-slate-600">
                        While we strive for 100% uptime and precise scheduler dispatch, the platform is provided on an "as is" and "as available" basis. Scheduler is not liable for third-party API outages or account restrictions imposed by social media networks.
                    </p>
                </section>

                <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-base mb-1">Contact for Legal Inquiries</h3>
                    <p className="text-xs text-slate-600">
                        Reach out with any questions regarding these terms:{" "}
                        <a href="mailto:asavant151@gmail.com" className="text-red-500 font-semibold hover:underline">
                            asavant151@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
