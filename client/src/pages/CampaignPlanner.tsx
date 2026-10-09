import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Sparkles,
    Calendar,
    Copy,
    Check,
    Loader2,
    Edit3,
    Trash2,
    Send,
} from "lucide-react";
import { SiX, SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AICreditBadge from "../components/AICreditBadge";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

interface CampaignPost {
    day: number;
    theme: string;
    headline: string;
    content: string;
    imagePrompt: string;
    scheduledFor: string;
    platforms: string[];
}

export default function CampaignPlanner() {
    const navigate = useNavigate();
    const { refreshCredits } = useAuth();

    // Form inputs
    const [brandNiche, setBrandNiche] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [postCount, setPostCount] = useState<number>(30);
    const [tone, setTone] = useState("Professional & High Energy");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "twitter"]);
    const [startDate, setStartDate] = useState(
        new Date(Date.now() + 86400000).toISOString().split("T")[0]
    );
    const [preferredTime, setPreferredTime] = useState("10:00");

    // State
    const [loading, setLoading] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const [campaignPosts, setCampaignPosts] = useState<CampaignPost[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const platformOptions = [
        { id: "linkedin", label: "LinkedIn", icon: LinkedInIcon },
        { id: "twitter", label: "Twitter / X", icon: SiX },
        { id: "instagram", label: "Instagram", icon: SiInstagram },
        { id: "facebook", label: "Facebook", icon: SiFacebook },
    ];

    const togglePlatform = (id: string) => {
        if (selectedPlatforms.includes(id)) {
            if (selectedPlatforms.length > 1) {
                setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
            } else {
                toast.error("At least one platform must be selected");
            }
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    const handleGenerateCampaign = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!brandNiche.trim()) {
            toast.error("Please describe your brand / niche");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/posts/campaign/generate-30-days", {
                brandNiche,
                targetAudience,
                tone,
                platforms: selectedPlatforms,
                postCount,
                startDate,
                preferredTime,
            });

            if (data?.campaign) {
                setCampaignPosts(data.campaign);
                toast.success(`Generated ${data.campaign.length} days of strategic content!`);
                refreshCredits();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to generate campaign");
            refreshCredits();
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSchedule = async () => {
        if (campaignPosts.length === 0) return;

        setScheduling(true);
        try {
            const { data } = await api.post("/api/posts/campaign/batch-schedule", {
                posts: campaignPosts,
            });

            toast.success(data.message || `Scheduled ${campaignPosts.length} posts!`);
            navigate("/schedule");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to schedule campaign");
        } finally {
            setScheduling(false);
        }
    };

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        toast.success("Post copied!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleRemovePost = (idx: number) => {
        setCampaignPosts(campaignPosts.filter((_, i) => i !== idx));
        toast.success("Post removed from campaign");
    };

    const startEditing = (idx: number) => {
        setEditingIndex(idx);
        setEditedContent(campaignPosts[idx].content);
    };

    const saveEditing = (idx: number) => {
        const updated = [...campaignPosts];
        updated[idx].content = editedContent;
        setCampaignPosts(updated);
        setEditingIndex(null);
        toast.success("Post content updated");
    };

    // Quick Sample
    const handleTrySample = () => {
        setBrandNiche("Organic Ayurvedic Skincare Brand & Natural Wellness");
        setTargetAudience("Health-conscious women & eco-friendly buyers aged 24-45");
        setTone("Educational, Calming & Inspiring");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* AI Credits Badge Banner */}
            <AICreditBadge />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-100 mb-2">
                        <CalendarDays className="size-3.5" /> 30-Day Autopilot Campaign
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900">
                        Monthly Content Campaign Planner
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Input your brand once, and let AI plan & schedule a full month of high-converting social posts in 1 click.
                    </p>
                </div>
            </div>

            {/* Campaign Generator Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
                <form onSubmit={handleGenerateCampaign} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Brand / Topic */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Your Brand / Business / Topic
                            </label>
                            <input
                                type="text"
                                value={brandNiche}
                                onChange={(e) => setBrandNiche(e.target.value)}
                                placeholder="e.g. B2B AI Automation Agency, Fitness Coach, Sustainable Fashion"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>

                        {/* Target Audience */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Target Audience
                            </label>
                            <input
                                type="text"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                placeholder="e.g. Startup founders, busy professionals, yoga enthusiasts"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Post Count / Duration */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Campaign Duration
                            </label>
                            <select
                                value={postCount}
                                onChange={(e) => setPostCount(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                            >
                                <option value={7}>7 Days (1 Week Sprint)</option>
                                <option value={14}>14 Days (2 Weeks)</option>
                                <option value={30}>30 Days (Full Month Autopilot)</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Campaign Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                            />
                        </div>

                        {/* Daily Posting Time */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                                Daily Posting Time
                            </label>
                            <input
                                type="time"
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                            />
                        </div>
                    </div>

                    {/* Platforms Selection */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Publish To Platforms
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {platformOptions.map((p) => {
                                const isSelected = selectedPlatforms.includes(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => togglePlatform(p.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                                            isSelected
                                                ? "bg-red-50 border-red-200 text-red-600 shadow-2xs font-semibold"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        <p.icon className="size-3.5" />
                                        <span>{p.label}</span>
                                        {isSelected && <Check className="size-3 text-red-500 ml-1" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleTrySample}
                            className="text-xs text-slate-500 hover:text-red-500 font-medium"
                        >
                            ✨ Try Skincare Brand Example
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-8 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Planning {postCount}-Day Strategy...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" /> Generate {postCount}-Day Campaign
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Campaign Plan Output */}
            {campaignPosts.length > 0 && (
                <div className="space-y-6">
                    {/* Top Action Header */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                                Campaign Review ({campaignPosts.length} Posts Ready)
                            </span>
                            <h2 className="text-xl font-semibold mt-1">
                                {brandNiche} • {postCount}-Day Content Engine
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Review individual daily themes below, make edits if needed, and hit Schedule All to automate!
                            </p>
                        </div>

                        <button
                            onClick={handleBatchSchedule}
                            disabled={scheduling}
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-red-500/20 disabled:opacity-50 shrink-0"
                        >
                            {scheduling ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" /> Scheduling...
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" /> Approve & Schedule All ({campaignPosts.length} Posts)
                                </>
                            )}
                        </button>
                    </div>

                    {/* Campaign Days Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {campaignPosts.map((post, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top meta */}
                                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="size-7 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center">
                                                D{post.day}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                                                {post.theme}
                                            </span>
                                        </div>

                                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                            <Calendar className="size-3" />
                                            {new Date(post.scheduledFor).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}{" "}
                                            • {preferredTime}
                                        </span>
                                    </div>

                                    {/* Content or Edit Mode */}
                                    {editingIndex === idx ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                rows={6}
                                                className="w-full p-3 rounded-xl border border-red-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingIndex(null)}
                                                    className="px-3 py-1 rounded text-xs text-slate-500 hover:bg-slate-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => saveEditing(idx)}
                                                    className="px-3 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                                            {post.content}
                                        </p>
                                    )}
                                </div>

                                {/* Footer actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        {post.platforms.map((p) => (
                                            <span
                                                key={p}
                                                className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                                            >
                                                {p}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCopy(post.content, idx)}
                                            className="hover:text-slate-900 inline-flex items-center gap-1"
                                        >
                                            {copiedIndex === idx ? (
                                                <Check className="size-3 text-emerald-500" />
                                            ) : (
                                                <Copy className="size-3" />
                                            )}
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => startEditing(idx)}
                                            className="hover:text-slate-900 inline-flex items-center gap-1"
                                        >
                                            <Edit3 className="size-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleRemovePost(idx)}
                                            className="hover:text-red-500 text-slate-400 inline-flex items-center"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
