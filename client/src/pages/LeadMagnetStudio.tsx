import { useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import {
    Gift,
    Sparkles,
    Send,
    MessageSquare,
    CheckCircle2,
    Copy,
    Download,
    Plus,
    Trash2,
    Play,
    Pause,
    Bot,
    UserCheck,
    Zap,
    RefreshCw,
    Share2,
    Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AICreditBadge from "../components/AICreditBadge";
import FeatureGate from "../components/FeatureGate";
import { useNavigate } from "react-router-dom";

interface ICapturedLead {
    username: string;
    platform: string;
    commentText: string;
    dmSent: boolean;
    dmSentAt?: string;
    createdAt: string;
}

interface ILeadMagnetCampaign {
    _id: string;
    title: string;
    offerTopic?: string;
    triggerKeywords: string[];
    dmMessage: string;
    publicReplies: string[];
    postCaption?: string;
    resourceLink?: string;
    platform: string;
    status: "active" | "paused" | "draft";
    leadsCount: number;
    leads: ICapturedLead[];
    createdAt: string;
}

export default function LeadMagnetStudio() {
    const { refreshCredits } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"builder" | "automations" | "leads">("builder");
    const [campaigns, setCampaigns] = useState<ILeadMagnetCampaign[]>([]);
    const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalLeads: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [isAiDrafting, setIsAiDrafting] = useState(false);

    // Form inputs for new campaign
    const [offerTopic, setOfferTopic] = useState("");
    const [targetAudience, setTargetAudience] = useState("Content Creators & Founders");
    const [platform, setPlatform] = useState("instagram");
    const [customKeyword, setCustomKeyword] = useState("GUIDE");
    const [resourceLink, setResourceLink] = useState("https://yourwebsite.com/free-blueprint.pdf");

    // Drafted content
    const [draftedTitle, setDraftedTitle] = useState("");
    const [draftedKeywords, setDraftedKeywords] = useState<string[]>(["GUIDE", "PDF", "PLAYBOOK"]);
    const [newKeywordInput, setNewKeywordInput] = useState("");
    const [draftedCaption, setDraftedCaption] = useState("");
    const [draftedPublicReplies, setDraftedPublicReplies] = useState<string[]>([
        "Sent it straight to your DM! Check your inbox 🚀",
        "Check your messages! Just dropped the link in your DM 🔥",
        "Sent over! Let me know if you get value from it 📥",
    ]);
    const [draftedDm, setDraftedDm] = useState("");

    // Simulator states
    const [simCampaignId, setSimCampaignId] = useState<string>("");
    const [simUsername, setSimUsername] = useState("@growth_hunter");
    const [simComment, setSimComment] = useState("Can I get the GUIDE please? 🔥");
    const [simPlatform, setSimPlatform] = useState("instagram");
    const [simResult, setSimResult] = useState<any>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // Leads search
    const [leadSearchQuery, setLeadSearchQuery] = useState("");
    const [selectedCampaignFilter, setSelectedCampaignFilter] = useState("all");

    // Fetch campaigns
    const fetchCampaigns = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get("/api/lead-magnets");
            setCampaigns(res.data.leadMagnets || []);
            setStats(res.data.stats || { totalCampaigns: 0, activeCampaigns: 0, totalLeads: 0 });
            if (res.data.leadMagnets?.length > 0 && !simCampaignId) {
                setSimCampaignId(res.data.leadMagnets[0]._id);
            }
        } catch (error: any) {
            console.error("Failed to load lead magnets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Draft with AI
    const handleAiDraft = async () => {
        if (!offerTopic.trim()) {
            toast.error("Please enter a free guide or lead magnet topic!");
            return;
        }

        try {
            setIsAiDrafting(true);
            const res = await axios.post("/api/lead-magnets/ai-draft", {
                offerTopic,
                targetAudience,
                platform,
                customKeyword,
            });

            const data = res.data.data;
            setDraftedTitle(data.title || `${offerTopic} Funnel`);
            setDraftedKeywords(data.triggerKeywords || [customKeyword.toUpperCase(), "PDF", "FREE"]);
            setDraftedCaption(data.postCaption || "");
            setDraftedPublicReplies(data.publicReplies || []);
            setDraftedDm(data.dmMessage || "");

            toast.success("✨ Lead Magnet Funnel generated successfully!");
            refreshCredits();
        } catch (error: any) {
            if (error.response?.data?.isQuotaExhausted) {
                toast.error("⚠️ AI Credits Exhausted! Add your Gemini API Key in Settings.", { duration: 5000 });
            } else {
                toast.error(error.response?.data?.message || "Failed to generate funnel draft.");
            }
        } finally {
            setIsAiDrafting(false);
        }
    };

    // Add trigger keyword
    const handleAddKeyword = () => {
        if (newKeywordInput.trim()) {
            const upper = newKeywordInput.trim().toUpperCase();
            if (!draftedKeywords.includes(upper)) {
                setDraftedKeywords([...draftedKeywords, upper]);
            }
            setNewKeywordInput("");
        }
    };

    // Remove trigger keyword
    const handleRemoveKeyword = (keywordToRemove: string) => {
        setDraftedKeywords(draftedKeywords.filter((k) => k !== keywordToRemove));
    };

    // Save campaign
    const handleSaveCampaign = async () => {
        if (!draftedTitle.trim() || !draftedDm.trim() || !draftedKeywords.length) {
            toast.error("Please ensure Campaign Title, Trigger Keywords, and DM Message are filled!");
            return;
        }

        try {
            const payload = {
                title: draftedTitle,
                offerTopic,
                triggerKeywords: draftedKeywords,
                dmMessage: draftedDm,
                publicReplies: draftedPublicReplies,
                postCaption: draftedCaption,
                resourceLink,
                platform,
                status: "active",
            };

            await axios.post("/api/lead-magnets", payload);
            toast.success("🚀 Lead Magnet Automation Activated!");
            fetchCampaigns();
            setActiveTab("automations");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save campaign.");
        }
    };

    // Toggle status (Active / Paused)
    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === "active" ? "paused" : "active";
        try {
            await axios.put(`/api/lead-magnets/${id}`, { status: nextStatus });
            toast.success(`Campaign ${nextStatus === "active" ? "Activated" : "Paused"}!`);
            fetchCampaigns();
        } catch (error: any) {
            toast.error("Failed to update campaign status.");
        }
    };

    // Delete campaign
    const handleDeleteCampaign = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this lead magnet automation?")) return;
        try {
            await axios.delete(`/api/lead-magnets/${id}`);
            toast.success("Campaign deleted.");
            fetchCampaigns();
        } catch (error: any) {
            toast.error("Failed to delete campaign.");
        }
    };

    // Run Simulator
    const handleRunSimulation = async () => {
        if (!simCampaignId) {
            toast.error("Please select a campaign to simulate!");
            return;
        }

        try {
            setIsSimulating(true);
            setSimResult(null);
            const res = await axios.post(`/api/lead-magnets/${simCampaignId}/test-trigger`, {
                username: simUsername,
                commentText: simComment,
                platform: simPlatform,
            });

            setSimResult(res.data);
            if (res.data.matched) {
                toast.success("🎉 Trigger Matched! DM sent in simulation.");
                fetchCampaigns();
            } else {
                toast(res.data.message, { icon: "ℹ️" });
            }
        } catch (error: any) {
            toast.error("Simulation failed.");
        } finally {
            setIsSimulating(false);
        }
    };

    // Copy to clipboard
    const copyToClipboard = (text: string, msg: string = "Copied to clipboard!") => {
        navigator.clipboard.writeText(text);
        toast.success(msg);
    };

    // Export Leads as CSV
    const exportLeadsCsv = () => {
        const allLeads: any[] = [];
        campaigns.forEach((camp) => {
            camp.leads?.forEach((lead) => {
                allLeads.push({
                    Campaign: camp.title,
                    Platform: lead.platform,
                    Username: lead.username,
                    Comment: lead.commentText,
                    DmSent: lead.dmSent ? "YES" : "NO",
                    Date: new Date(lead.createdAt).toLocaleString(),
                });
            });
        });

        if (allLeads.length === 0) {
            toast.error("No captured leads found yet to export!");
            return;
        }

        const headers = ["Campaign", "Platform", "Username", "Comment", "DmSent", "Date"];
        const rows = allLeads.map((l) =>
            headers.map((h) => `"${(l[h] || "").toString().replace(/"/g, '""')}"`).join(",")
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `social-leads-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("📥 Leads CSV exported successfully!");
    };

    // Filtered leads
    const allCapturedLeads = campaigns.flatMap((c) =>
        (c.leads || []).map((l) => ({ ...l, campaignTitle: c.title, campaignId: c._id }))
    );

    const filteredLeads = allCapturedLeads.filter((l) => {
        const matchesSearch =
            l.username.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
            l.commentText.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
            l.campaignTitle.toLowerCase().includes(leadSearchQuery.toLowerCase());
        const matchesCampaign =
            selectedCampaignFilter === "all" || l.campaignId === selectedCampaignFilter;
        return matchesSearch && matchesCampaign;
    });

    return (
        <div className="space-y-6 pb-12">
            <FeatureGate
                requiredPlan="agency"
                featureName="🎁 'Comment & Get' Auto-Lead Magnet Funnel Studio"
                featureDescription="Automatically detect comment keywords (e.g. 'GUIDE', 'PDF') on Instagram, Facebook & Twitter and send instant personalized DMs with download links."
                benefits={[
                    "🤖 AI Funnel Copilot (Viral Caption, Keywords, Rotating Public Replies, DM Copy)",
                    "⚡ Real-Time Comment-to-DM Trigger Simulator Studio",
                    "👥 Captured Hot Leads CRM & Status Tracking",
                    "📥 1-Click Export Leads to CSV / Excel",
                    "🚀 Explode organic reach by 10x with comment algorithm loops",
                ]}
            >
                {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-red-600 via-pink-600 to-rose-700 p-6 sm:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
                        <Gift className="size-3.5" /> "Comment & Get" Growth Automation
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Auto-Lead Magnet Funnel Studio
                    </h1>
                    <p className="text-rose-100 text-sm mt-1 max-w-2xl">
                        Turn public social comments into high-converting direct message leads.
                        Explode your engagement 10x with automated instant DM delivery and public comment replies.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <AICreditBadge compact={true} />
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Total Automations
                        </div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">
                            {stats.totalCampaigns}
                        </div>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <Zap className="size-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Active Funnels
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">
                            {stats.activeCampaigns}
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Play className="size-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Total Hot Leads Captured
                        </div>
                        <div className="text-2xl font-bold text-indigo-600 mt-1">
                            {stats.totalLeads}
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <UserCheck className="size-6" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("builder")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "builder"
                            ? "bg-red-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Sparkles className="size-4" />
                    ✨ AI Funnel Copilot
                </button>
                <button
                    onClick={() => setActiveTab("automations")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "automations"
                            ? "bg-red-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Zap className="size-4" />
                    ⚡ Active Automations & Simulator ({campaigns.length})
                </button>
                <button
                    onClick={() => setActiveTab("leads")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "leads"
                            ? "bg-red-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <UserCheck className="size-4" />
                    👥 Captured Leads CRM ({allCapturedLeads.length})
                </button>
            </div>

            {/* TAB 1: AI FUNNEL BUILDER */}
            {activeTab === "builder" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Setup Form */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Bot className="size-5 text-red-600" />
                            <h2 className="font-semibold text-slate-800">
                                1. Configure Lead Magnet & Offer
                            </h2>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                🎁 Free Resource / Lead Magnet Description
                            </label>
                            <textarea
                                value={offerTopic}
                                onChange={(e) => setOfferTopic(e.target.value)}
                                placeholder="e.g. Free 10-Page Instagram Growth Blueprint PDF + 50 Viral Hook Templates"
                                rows={3}
                                className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Target Audience
                                </label>
                                <input
                                    type="text"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="e.g. Creators, Founders"
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Trigger Keyword
                                </label>
                                <input
                                    type="text"
                                    value={customKeyword}
                                    onChange={(e) => setCustomKeyword(e.target.value.toUpperCase())}
                                    placeholder="e.g. GUIDE, BLUEPRINT"
                                    className="w-full text-sm font-mono uppercase font-bold text-red-600 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Target Platform
                                </label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                                >
                                    <option value="instagram">Instagram</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="twitter">Twitter / X</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="all">All Channels</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Download File / URL Link
                                </label>
                                <input
                                    type="text"
                                    value={resourceLink}
                                    onChange={(e) => setResourceLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAiDraft}
                            disabled={isAiDrafting}
                            className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                            {isAiDrafting ? (
                                <>
                                    <RefreshCw className="size-4 animate-spin" />
                                    AI is Crafting High-Converting Funnel...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    Generate Complete Funnel Package (1 Credit)
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Preview & Funnel Package */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Zap className="size-4 text-amber-500" />
                                        2. Generated Funnel Package (Review & Customize)
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Customize your trigger keywords, public reply variations, and DM copy.
                                    </p>
                                </div>
                            </div>

                            {/* Campaign Title */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Campaign Title
                                </label>
                                <input
                                    type="text"
                                    value={draftedTitle}
                                    onChange={(e) => setDraftedTitle(e.target.value)}
                                    placeholder="Campaign Name..."
                                    className="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>

                            {/* Trigger Keywords Chip Editor */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Trigger Keywords (Triggers automation when present in comment)
                                </label>
                                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    {draftedKeywords.map((kw) => (
                                        <span
                                            key={kw}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-mono font-bold rounded-lg"
                                        >
                                            #{kw}
                                            <button
                                                onClick={() => handleRemoveKeyword(kw)}
                                                className="hover:text-red-900 cursor-pointer"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                    <div className="inline-flex items-center gap-1 ml-auto">
                                        <input
                                            type="text"
                                            value={newKeywordInput}
                                            onChange={(e) => setNewKeywordInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                                            placeholder="+ Add Keyword"
                                            className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-red-500 font-mono uppercase"
                                        />
                                        <button
                                            onClick={handleAddKeyword}
                                            className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer"
                                        >
                                            <Plus className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Post Copy with CTA */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        📱 Viral Post Copy (with Call-To-Action)
                                    </label>
                                    <button
                                        onClick={() => copyToClipboard(draftedCaption, "Post caption copied!")}
                                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer font-medium"
                                    >
                                        <Copy className="size-3" /> Copy Caption
                                    </button>
                                </div>
                                <textarea
                                    value={draftedCaption}
                                    onChange={(e) => setDraftedCaption(e.target.value)}
                                    rows={4}
                                    placeholder="Post copy that will be published..."
                                    className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none font-sans"
                                />
                            </div>

                            {/* Public Comment Replies Variations */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    💬 Public Comment Reply Variations (Cycles naturally to prevent spam flags)
                                </label>
                                <div className="space-y-2">
                                    {draftedPublicReplies.map((reply, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-400 font-semibold w-5">
                                                #{idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={reply}
                                                onChange={(e) => {
                                                    const updated = [...draftedPublicReplies];
                                                    updated[idx] = e.target.value;
                                                    setDraftedPublicReplies(updated);
                                                }}
                                                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Direct Message (DM) Blueprint */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    📩 Direct Message (DM) Template
                                </label>
                                <textarea
                                    value={draftedDm}
                                    onChange={(e) => setDraftedDm(e.target.value)}
                                    rows={3}
                                    placeholder="Private message sent to lead's DM inbox..."
                                    className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none font-sans"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        navigate("/schedule", { state: { caption: draftedCaption } });
                                    }}
                                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Share2 className="size-4" />
                                    Schedule as Social Post
                                </button>
                                <button
                                    onClick={handleSaveCampaign}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle2 className="size-4" />
                                    Save & Activate Automation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ACTIVE AUTOMATIONS & SIMULATOR */}
            {activeTab === "automations" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Campaign List */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 text-lg">
                                Active Automation Campaigns ({campaigns.length})
                            </h2>
                            <button
                                onClick={fetchCampaigns}
                                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                            </button>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                                <div className="size-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                    <Gift className="size-7" />
                                </div>
                                <h3 className="font-semibold text-slate-800 text-base">
                                    No Lead Magnet Automations Created Yet
                                </h3>
                                <p className="text-sm text-slate-500 max-w-md mx-auto">
                                    Use the AI Funnel Copilot to craft your first "Comment-to-DM" campaign and start capturing hot leads!
                                </p>
                                <button
                                    onClick={() => setActiveTab("builder")}
                                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl text-sm cursor-pointer shadow-xs hover:bg-red-700"
                                >
                                    Create Your First Funnel
                                </button>
                            </div>
                        ) : (
                            campaigns.map((camp) => (
                                <div
                                    key={camp._id}
                                    className={`bg-white p-5 rounded-2xl border transition-all ${
                                        simCampaignId === camp._id
                                            ? "border-red-500 shadow-md ring-1 ring-red-500/20"
                                            : "border-slate-200 hover:border-slate-300 shadow-xs"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-base">
                                                    {camp.title}
                                                </h3>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                                        camp.status === "active"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {camp.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                <span className="text-xs text-slate-500">Triggers:</span>
                                                {camp.triggerKeywords.map((k) => (
                                                    <span
                                                        key={k}
                                                        className="px-2 py-0.5 bg-red-50 text-red-600 font-mono text-xs font-bold rounded-md"
                                                    >
                                                        #{k}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleToggleStatus(camp._id, camp.status)}
                                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                                    camp.status === "active"
                                                        ? "text-emerald-600 hover:bg-emerald-50"
                                                        : "text-slate-400 hover:bg-slate-100"
                                                }`}
                                                title={camp.status === "active" ? "Pause Automation" : "Activate Automation"}
                                            >
                                                {camp.status === "active" ? (
                                                    <Pause className="size-4" />
                                                ) : (
                                                    <Play className="size-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSimCampaignId(camp._id);
                                                    toast.success(`Selected "${camp.title}" in simulator!`);
                                                }}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                                                title="Load into Simulator"
                                            >
                                                <Zap className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCampaign(camp._id)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                                title="Delete Campaign"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* DM Preview */}
                                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-mono">
                                        <span className="font-bold text-slate-700 block mb-1">
                                            📩 Auto DM Template:
                                        </span>
                                        {camp.dmMessage}
                                    </div>

                                    {/* Stats & Leads count */}
                                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                        <span>
                                            Captured Leads:{" "}
                                            <strong className="text-slate-800">{camp.leads?.length || 0}</strong>
                                        </span>
                                        <span>Created: {new Date(camp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: Live Simulator Studio */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 h-fit sticky top-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Zap className="size-5 text-amber-500" />
                            <div>
                                <h3 className="font-bold text-slate-800">
                                    ⚡ Live Comment-to-DM Simulator
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Test your automation trigger and watch the live reply & DM delivery!
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Select Campaign to Test
                            </label>
                            <select
                                value={simCampaignId}
                                onChange={(e) => setSimCampaignId(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                            >
                                <option value="" disabled>
                                    -- Select Automation --
                                </option>
                                {campaigns.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.title} ({c.triggerKeywords.join(", ")})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Test User Handle
                                </label>
                                <input
                                    type="text"
                                    value={simUsername}
                                    onChange={(e) => setSimUsername(e.target.value)}
                                    placeholder="@handle"
                                    className="w-full text-xs font-mono border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Platform
                                </label>
                                <select
                                    value={simPlatform}
                                    onChange={(e) => setSimPlatform(e.target.value)}
                                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-red-500"
                                >
                                    <option value="instagram">Instagram</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="twitter">Twitter / X</option>
                                    <option value="facebook">Facebook</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Simulated Public Comment Text
                            </label>
                            <input
                                type="text"
                                value={simComment}
                                onChange={(e) => setSimComment(e.target.value)}
                                placeholder="Comment containing keyword..."
                                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <button
                            onClick={handleRunSimulation}
                            disabled={isSimulating || !simCampaignId}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                            {isSimulating ? (
                                <>
                                    <RefreshCw className="size-4 animate-spin" />
                                    Testing Trigger Detection...
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Simulate Comment & Trigger DM
                                </>
                            )}
                        </button>

                        {/* Simulation Output Card */}
                        {simResult && (
                            <div
                                className={`p-4 rounded-xl border text-xs space-y-3 animate-in fade-in duration-200 ${
                                    simResult.matched
                                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                                        : "bg-amber-50 border-amber-200 text-amber-900"
                                }`}
                            >
                                <div className="font-bold flex items-center gap-1.5">
                                    {simResult.matched ? (
                                        <>
                                            <CheckCircle2 className="size-4 text-emerald-600" />
                                            Trigger Keyword Matched!
                                        </>
                                    ) : (
                                        "⚠️ No Keyword Matched"
                                    )}
                                </div>

                                {simResult.matched && (
                                    <>
                                        <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                                            <span className="text-slate-500 font-semibold block mb-0.5">
                                                💬 Auto Public Comment Reply:
                                            </span>
                                            <span className="text-slate-800 font-medium">
                                                "{simResult.replySent}"
                                            </span>
                                        </div>

                                        <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                                            <span className="text-slate-500 font-semibold block mb-0.5">
                                                📩 Direct Message (DM) Delivered:
                                            </span>
                                            <span className="text-slate-800 font-mono">
                                                {simResult.dmSent}
                                            </span>
                                        </div>

                                        <div className="text-[11px] text-emerald-700 font-medium">
                                            Lead added to CRM table. Total Captured: {simResult.totalLeads}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: CAPTURED LEADS CRM */}
            {activeTab === "leads" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg">
                                Captured Leads CRM ({filteredLeads.length})
                            </h2>
                            <p className="text-xs text-slate-500">
                                Export and sync social leads that requested your free lead magnet.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportLeadsCsv}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                            >
                                <Download className="size-4" />
                                Export Leads to CSV
                            </button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={leadSearchQuery}
                                onChange={(e) => setLeadSearchQuery(e.target.value)}
                                placeholder="Search by username, comment, or campaign..."
                                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <select
                            value={selectedCampaignFilter}
                            onChange={(e) => setSelectedCampaignFilter(e.target.value)}
                            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-red-500 w-full sm:w-auto"
                        >
                            <option value="all">All Campaigns</option>
                            {campaigns.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Leads Table */}
                    {filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <MessageSquare className="size-10 mx-auto text-slate-300" />
                            <div className="text-sm font-medium text-slate-600">No Leads Found</div>
                            <p className="text-xs text-slate-400">
                                Run a test simulation or promote your lead magnet on social media!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="p-3">User</th>
                                        <th className="p-3">Platform</th>
                                        <th className="p-3">Campaign</th>
                                        <th className="p-3">Comment Text</th>
                                        <th className="p-3">DM Status</th>
                                        <th className="p-3">Captured At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredLeads.map((lead, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-3 font-semibold text-slate-900 font-mono">
                                                {lead.username}
                                            </td>
                                            <td className="p-3">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium capitalize">
                                                    {lead.platform}
                                                </span>
                                            </td>
                                            <td className="p-3 font-medium text-slate-700">
                                                {lead.campaignTitle}
                                            </td>
                                            <td className="p-3 text-slate-800 italic max-w-xs truncate">
                                                "{lead.commentText}"
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                                    <CheckCircle2 className="size-3.5" /> Sent
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-400">
                                                {new Date(lead.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            </FeatureGate>
        </div>
    );
}
