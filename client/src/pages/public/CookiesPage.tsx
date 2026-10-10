import { Cookie, Shield, Settings } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function CookiesPage() {
    return (
        <div className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
            <SEO
                title="Cookie Policy"
                description="Understand how Social Media Scheduler uses essential and performance cookies to manage user authentication and app analytics."
                keywords="cookie policy, tracking policy, analytics cookies"
            />
            {/* Header */}
            <div className="mb-12 border-b border-slate-100 pb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    Cookie Policy
                </span>
                <h1 className="text-4xl font-serif font-medium text-slate-900 mt-4 mb-2">Cookie Policy</h1>
                <p className="text-sm text-slate-500">Effective Date: October 2026</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Cookie className="size-5 text-red-500" /> 1. What Are Cookies?
                    </h2>
                    <p className="text-slate-600">
                        Cookies are small text files stored on your browser or device when you visit a website. They allow the platform to recognize your device, remember authentication states, and ensure optimal performance.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Shield className="size-5 text-red-500" /> 2. Types of Cookies We Use
                    </h2>

                    <div className="space-y-4">
                        <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                            <h3 className="font-semibold text-slate-900 text-base mb-1">Essential / Authentication Cookies</h3>
                            <p className="text-xs text-slate-600">
                                Strictly necessary to maintain your logged-in session, prevent CSRF attacks, and verify API authorization tokens. These cannot be disabled without breaking application functionality.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                            <h3 className="font-semibold text-slate-900 text-base mb-1">Preference & Functional Cookies</h3>
                            <p className="text-xs text-slate-600">
                                Remember your UI preferences such as light/dark settings, selected AI models, and default posting channels.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                            <h3 className="font-semibold text-slate-900 text-base mb-1">Performance & Analytics</h3>
                            <p className="text-xs text-slate-600">
                                Help us understand how users navigate through the app and detect frontend crashes or sluggish API endpoints.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Settings className="size-5 text-red-500" /> 3. Managing Your Cookie Preferences
                    </h2>
                    <p className="text-slate-600">
                        You can adjust your cookie settings through your browser's preference settings at any time (e.g., Chrome, Safari, Firefox). Note that disabling essential cookies will prevent you from signing in to your Scheduler dashboard.
                    </p>
                </section>

                <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-base mb-1">Got Questions?</h3>
                    <p className="text-xs text-slate-600">
                        For questions regarding our cookie practices, reach out to:{" "}
                        <a href="mailto:asavant151@gmail.com" className="text-red-500 font-semibold hover:underline">
                            asavant151@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
