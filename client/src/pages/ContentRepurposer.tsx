import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    Link2,
    FileText,
    Copy,
    Check,
    Calendar,
    ArrowRight,
    Loader2,
    Layers,
    Send,
    Flame,
    Info,
} from "lucide-react";
import { SiX, SiFacebook, SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";
import api from "../api/axios";
import toast from "react-hot-toast";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

interface RepurposedData {
    title: string;
    summary: string;
    keyTakeaways: string[];
    twitterThread: string[];
    linkedinPost: string;
    instagram: {
        caption: string;
        imagePrompt: string;
    };
    facebookPost: string;
}

export default function ContentRepurposer() {
    const navigate = useNavigate();

    // Input mode state
    const [inputType, setInputType] = useState<"url" | "youtube" | "text">("url");
    const [urlInput, setUrlInput] = useState("");
    const [textInput, setTextInput] = useState("");
    const [tone, setTone] = useState("Engaging & Viral");

    // Loading & Result state
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RepurposedData | null>(null);
    const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "instagram" | "facebook" | "summary">("twitter");
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const tones = [
        "Engaging & Viral",
        "Professional & Authoritative",
        "Casual & Storytelling",
        "Educational / Step-by-Step",
        "Witty & Humorous",
    ];

    const handleCopy = (text: string, identifier: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(identifier);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAllTweets = () => {
        if (!result?.twitterThread) return;
        const allTweets = result.twitterThread.join("\n\n---\n\n");
        handleCopy(allTweets, "all-tweets");
    };

    const handleSendToScheduler = (content: string, platformId: string) => {
        // Navigate to schedule page with pre-filled content
        navigate("/schedule", {
            state: {
                initialContent: content,
                initialPlatform: platformId,
            },
        });
        toast.success(`Loaded into Scheduler for ${platformId.toUpperCase()}`);
    };

    const handleRepurpose = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const contentSource = inputType === "text" ? textInput : urlInput;
        if (!contentSource.trim()) {
            toast.error(inputType === "text" ? "Please paste your content/text" : "Please enter a valid URL");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/posts/repurpose", {
                inputType: inputType === "text" ? "text" : "url",
                sourceText: inputType === "text" ? textInput : undefined,
                sourceUrl: inputType !== "text" ? urlInput : undefined,
                tone,
            });

            if (data?.data) {
                setResult(data.data);
                toast.success("Content repurposed successfully across 5 formats!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to repurpose content");
        } finally {
            setLoading(false);
        }
    };

    // Quick Test Examples
    const handleTryExample = (type: "blog" | "youtube" | "text") => {
        if (type === "blog") {
            setInputType("url");
            setUrlInput("https://techcrunch.com");
        } else if (type === "youtube") {
            setInputType("youtube");
            setUrlInput("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        } else {
            setInputType("text");
            setTextInput(
                "Building an AI startup in 2026 requires focusing on distribution rather than raw model weights. Open-source models have commoditized intelligence, making UX, workflow integrations, and proprietary datasets the real competitive moats. Small teams of 3-5 engineers are now generating millions in ARR by solving hyper-specific domain problems."
            );
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-100 mb-2">
                        <Sparkles className="size-3.5" /> 1-Click Multi-Format Repurposer
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900">
                        Content Repurposer Studio
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Turn 1 blog post, YouTube link, or raw thought into 5 platform-optimized formats in seconds.
                    </p>
                </div>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
                {/* Input Type Switcher */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setInputType("url")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            inputType === "url"
                                ? "bg-red-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        <Link2 className="size-4" /> Blog / Article URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setInputType("youtube")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            inputType === "youtube"
                                ? "bg-red-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        <SiYoutube className="size-4" /> YouTube Video
                    </button>
                    <button
                        type="button"
                        onClick={() => setInputType("text")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            inputType === "text"
                                ? "bg-red-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        <FileText className="size-4" /> Raw Text / Notes
                    </button>
                </div>

                <form onSubmit={handleRepurpose} className="space-y-6">
                    {/* URL Input */}
                    {inputType !== "text" ? (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                {inputType === "youtube" ? "YouTube Video URL" : "Blog / Article Web URL"}
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder={
                                        inputType === "youtube"
                                            ? "https://www.youtube.com/watch?v=..."
                                            : "https://yourblog.com/posts/ai-trends"
                                    }
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Paste Article, Newsletter, or Notes
                            </label>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                rows={5}
                                placeholder="Paste your article draft, meeting transcript, or brainstorm notes here..."
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
                            />
                        </div>
                    )}

                    {/* Tone Selection */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Select Output Tone
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map((t) => (
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

                    {/* Action row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Info className="size-3.5" />
                            <span>Quick test:</span>
                            <button
                                type="button"
                                onClick={() => handleTryExample("text")}
                                className="text-red-500 hover:underline font-medium"
                            >
                                Sample Tech Notes
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-8 py-3 rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Repurposing with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" /> Repurpose into 5 Formats
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            {result && (
                <div className="space-y-6">
                    {/* Header bar of results */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                                Repurposed Package
                            </span>
                            <h2 className="text-xl font-semibold mt-1">{result.title}</h2>
                            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{result.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleCopyAllTweets}
                                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium px-4 py-2 rounded-lg transition-all"
                            >
                                <Copy className="size-3.5" /> Copy Everything
                            </button>
                        </div>
                    </div>

                    {/* Platform Selector Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                        <button
                            onClick={() => setActiveTab("twitter")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === "twitter"
                                    ? "bg-black text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <SiX className="size-3.5" /> Twitter / X Thread ({result.twitterThread?.length || 0})
                        </button>

                        <button
                            onClick={() => setActiveTab("linkedin")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === "linkedin"
                                    ? "bg-[#0A66C2] text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <LinkedInIcon className="size-3.5" /> LinkedIn Post
                        </button>

                        <button
                            onClick={() => setActiveTab("instagram")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === "instagram"
                                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <SiInstagram className="size-3.5" /> Instagram & Visual
                        </button>

                        <button
                            onClick={() => setActiveTab("facebook")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === "facebook"
                                    ? "bg-[#1877F2] text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <SiFacebook className="size-3.5" /> Facebook Post
                        </button>

                        <button
                            onClick={() => setActiveTab("summary")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === "summary"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <Layers className="size-3.5" /> Key Takeaways
                        </button>
                    </div>

                    {/* Tab 1: Twitter / X Thread */}
                    {activeTab === "twitter" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    🧵 {result.twitterThread?.length} Tweets in this series
                                </span>
                                <button
                                    onClick={handleCopyAllTweets}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black"
                                >
                                    {copiedIndex === "all-tweets" ? (
                                        <Check className="size-3.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="size-3.5" />
                                    )}
                                    Copy Entire Thread
                                </button>
                            </div>

                            <div className="space-y-3">
                                {result.twitterThread?.map((tweet, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                                    >
                                        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                            {tweet}
                                        </p>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
                                            <span>
                                                Tweet {i + 1} • {tweet.length} chars
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleCopy(tweet, `tweet-${i}`)}
                                                    className="hover:text-slate-900 inline-flex items-center gap-1 font-medium"
                                                >
                                                    {copiedIndex === `tweet-${i}` ? (
                                                        <Check className="size-3 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="size-3" />
                                                    )}
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => handleSendToScheduler(tweet, "twitter")}
                                                    className="hover:text-red-500 inline-flex items-center gap-1 font-medium text-red-500"
                                                >
                                                    <Calendar className="size-3" /> Schedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: LinkedIn Post */}
                    {activeTab === "linkedin" && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center">
                                        <LinkedInIcon className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">LinkedIn Format</h4>
                                        <span className="text-[11px] text-slate-400">
                                            Optimized with hook, line breaks & engagement CTA
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(result.linkedinPost, "linkedin")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition-all"
                                    >
                                        {copiedIndex === "linkedin" ? (
                                            <Check className="size-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="size-3.5" />
                                        )}
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => handleSendToScheduler(result.linkedinPost, "linkedin")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all shadow-xs"
                                    >
                                        <Send className="size-3.5" /> Schedule to LinkedIn
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                                {result.linkedinPost}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Instagram Post + Leonardo Prompt */}
                    {activeTab === "instagram" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Instagram Caption */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-pink-600">
                                        📸 Instagram Caption
                                    </span>
                                    <button
                                        onClick={() => handleCopy(result.instagram?.caption || "", "ig-caption")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-black"
                                    >
                                        {copiedIndex === "ig-caption" ? (
                                            <Check className="size-3 text-emerald-500" />
                                        ) : (
                                            <Copy className="size-3" />
                                        )}
                                        Copy Caption
                                    </button>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {result.instagram?.caption}
                                </div>
                                <button
                                    onClick={() => handleSendToScheduler(result.instagram?.caption || "", "instagram")}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    <Send className="size-3.5" /> Schedule to Instagram
                                </button>
                            </div>

                            {/* Leonardo.ai Image Prompt */}
                            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                            <Sparkles className="size-3.5" /> Leonardo.ai Visual Prompt
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleCopy(result.instagram?.imagePrompt || "", "leo-prompt")
                                            }
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white"
                                        >
                                            {copiedIndex === "leo-prompt" ? (
                                                <Check className="size-3 text-emerald-400" />
                                            ) : (
                                                <Copy className="size-3" />
                                            )}
                                            Copy Prompt
                                        </button>
                                    </div>
                                    <p className="text-xs text-purple-200 mb-2">
                                        Use this prompt in AI Composer to generate a matching HD visual:
                                    </p>
                                    <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-xs font-mono text-purple-100 leading-relaxed">
                                        {result.instagram?.imagePrompt}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/ai-composer")}
                                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-white text-purple-950 hover:bg-purple-50 text-xs font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    Open AI Image Composer <ArrowRight className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Facebook Post */}
                    {activeTab === "facebook" && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                                        <SiFacebook className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">Facebook Discussion Post</h4>
                                        <span className="text-[11px] text-slate-400">
                                            Community-friendly conversational tone
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(result.facebookPost, "facebook")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition-all"
                                    >
                                        {copiedIndex === "facebook" ? (
                                            <Check className="size-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="size-3.5" />
                                        )}
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => handleSendToScheduler(result.facebookPost, "facebook")}
                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all shadow-xs"
                                    >
                                        <Send className="size-3.5" /> Schedule to Facebook
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {result.facebookPost}
                            </div>
                        </div>
                    )}

                    {/* Tab 5: Key Takeaways */}
                    {activeTab === "summary" && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Flame className="size-4 text-amber-500" /> Core Insights & Takeaways
                            </h3>
                            <div className="space-y-3">
                                {result.keyTakeaways?.map((point, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                                    >
                                        <span className="size-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
