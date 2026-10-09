import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    Copy,
    Check,
    Loader2,
    Flame,
    Zap,
    Send,
    BrainCircuit,
    Layers,
    Target,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AICreditBadge from "../components/AICreditBadge";

interface DeconstructedData {
    analysis: {
        viralityScore: string;
        hookBreakdown: string;
        psychologicalTriggers: string[];
        structureBlueprint: string;
    };
    adaptedVariations: Array<{
        style: string;
        headline: string;
        content: string;
        imagePrompt: string;
    }>;
}

export default function CompetitorDecoder() {
    const navigate = useNavigate();
    const { refreshCredits } = useAuth();

    // Inputs
    const [viralContent, setViralContent] = useState("");
    const [userNiche, setUserNiche] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [tone, setTone] = useState("Engaging & Authoritative");

    // State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DeconstructedData | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const handleCopy = (text: string, identifier: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(identifier);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSendToScheduler = (content: string) => {
        navigate("/schedule", {
            state: {
                initialContent: content,
                initialPlatform: "linkedin",
            },
        });
        toast.success("Loaded into Scheduler!");
    };

    const handleDecode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!viralContent.trim()) {
            toast.error("Please paste the viral post content or post link");
            return;
        }

        if (!userNiche.trim()) {
            toast.error("Please specify your own brand, niche, or topic");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/posts/competitor/reverse-engineer", {
                viralContent,
                userNiche,
                targetAudience,
                tone,
            });

            if (data?.data) {
                setResult(data.data);
                toast.success("Viral post decoded! 3 original variations ready.");
                refreshCredits();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to reverse-engineer post");
            refreshCredits();
        } finally {
            setLoading(false);
        }
    };

    // Quick Sample
    const handleTrySample = () => {
        setViralContent(
            "I spent 10 years working 80-hour weeks as a software engineer.\nThen I quit and built a $50k/mo one-person business.\n\nHere are 5 brutal truths nobody tells you about leaving corporate life:\n\n1. Nobody cares about your credentials, only outcomes.\n2. Consistency beats talent every single day.\n3. Distribution is 10x more important than product.\n4. You will fail 10 times before 1 idea clicks.\n5. Freedom is better than a prestigious title.\n\nWhat would you do if you weren't afraid to start?"
        );
        setUserNiche("AI Automation Agency for E-Commerce Stores");
        setTargetAudience("Shopify store owners, e-commerce managers");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* AI Credits Badge Banner */}
            <AICreditBadge />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-100 mb-2">
                        <BrainCircuit className="size-3.5" /> Viral Post Decoder & Reverse-Engineer
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900">
                        Competitor Viral Post Deconstructor
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Paste any viral post on LinkedIn or X/Twitter. AI will decode its psychological hooks and generate 3 winning original variations for your brand.
                    </p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
                <form onSubmit={handleDecode} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Paste Viral Post Text or Link
                        </label>
                        <textarea
                            value={viralContent}
                            onChange={(e) => setViralContent(e.target.value)}
                            rows={5}
                            placeholder="Paste the viral post that performed exceptionally well (the hook, body, and CTA)..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Your Brand / Business / Niche
                            </label>
                            <input
                                type="text"
                                value={userNiche}
                                onChange={(e) => setUserNiche(e.target.value)}
                                placeholder="e.g. Real Estate Tech, Personal Finance, SaaS"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Target Audience
                            </label>
                            <input
                                type="text"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                placeholder="e.g. Founders & CMOs, High-Energy & Storytelling"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Select Output Tone
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {["Engaging & Authoritative", "Contrarian & Bold", "Storytelling & Vulnerable", "Educational & Checklist"].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTone(t)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        tone === t
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleTrySample}
                            className="text-xs text-slate-500 hover:text-red-500 font-medium"
                        >
                            ✨ Try Sample Viral Founder Post
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-8 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Decoding Psychology & Hooks...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" /> Reverse-Engineer & Generate 3 Variations
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            {result && (
                <div className="space-y-8">
                    {/* Psychology Breakdown Box */}
                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                                    Psychological Virality Deconstruction
                                </span>
                                <h2 className="text-2xl font-serif font-medium mt-1">Why this post went viral</h2>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shrink-0">
                                <Flame className="size-5 text-amber-400" />
                                <div>
                                    <span className="text-[10px] uppercase text-slate-300 block font-bold">Virality Rating</span>
                                    <span className="text-base font-bold text-white">{result.analysis.viralityScore}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Hook Breakdown */}
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-red-400 mb-2">
                                    <Zap className="size-4" /> The Hook Mechanism
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {result.analysis.hookBreakdown}
                                </p>
                            </div>

                            {/* Psychological Triggers */}
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400 mb-2">
                                    <Target className="size-4" /> Psychological Triggers
                                </div>
                                <ul className="space-y-1.5 text-xs text-slate-300">
                                    {result.analysis.psychologicalTriggers?.map((trig, i) => (
                                        <li key={i} className="flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-amber-400" />
                                            <span>{trig}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Structure Blueprint */}
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400 mb-2">
                                    <Layers className="size-4" /> Structural Formula
                                </div>
                                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                                    {result.analysis.structureBlueprint}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3 Adapted Variations */}
                    <div>
                        <div className="mb-6">
                            <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                                Adapted for {userNiche}
                            </span>
                            <h2 className="text-2xl font-serif font-semibold text-slate-900 mt-1">
                                3 High-Converting Original Variations
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {result.adaptedVariations?.map((variant, i) => (
                                <div
                                    key={i}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                                {variant.style}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">Var #{i + 1}</span>
                                        </div>

                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">{variant.headline}</h4>

                                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mb-6 font-sans">
                                            {variant.content}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopy(variant.content, `var-${i}`)}
                                                className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-all"
                                            >
                                                {copiedIndex === `var-${i}` ? (
                                                    <Check className="size-3.5 text-emerald-500" />
                                                ) : (
                                                    <Copy className="size-3.5" />
                                                )}
                                                Copy
                                            </button>

                                            <button
                                                onClick={() => handleSendToScheduler(variant.content)}
                                                className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition-all shadow-2xs"
                                            >
                                                <Send className="size-3.5" /> Schedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
