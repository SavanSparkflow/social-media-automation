import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
    UserIcon,
    LockIcon,
    SaveIcon,
    Loader2Icon,
    CheckCircle2Icon,
    KeyIcon,
    EyeIcon,
    EyeOffIcon,
    ExternalLinkIcon,
    SparklesIcon,
    InfoIcon,
    RefreshCwIcon,
    ZapIcon,
    AlertTriangleIcon,
    XCircleIcon,
} from 'lucide-react';

const AVATAR_OPTIONS = [
    { label: "Coral Sunset", bg: "from-red-500 to-pink-500" },
    { label: "Ocean Breeze", bg: "from-blue-500 to-cyan-500" },
    { label: "Purple Velvet", bg: "from-purple-500 to-indigo-500" },
    { label: "Emerald Spark", bg: "from-emerald-500 to-teal-500" },
    { label: "Amber Glow", bg: "from-amber-500 to-orange-500" },
];

const Settings = () => {
    const { user, updateUser, refreshCredits } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'apikeys'>('profile');

    // Profile state
    const [name, setName] = useState(user?.name || '');
    const [avatarBg, setAvatarBg] = useState(user?.avatarUrl || AVATAR_OPTIONS[0].bg);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // API Keys state
    const [geminiKey, setGeminiKey] = useState('');
    const [leonardoKey, setLeonardoKey] = useState('');
    const [zernioKey, setZernioKey] = useState('');
    const [systemKeys, setSystemKeys] = useState<{
        hasSystemGemini: boolean;
        hasSystemLeonardo: boolean;
        hasSystemZernio: boolean;
    }>({
        hasSystemGemini: false,
        hasSystemLeonardo: false,
        hasSystemZernio: false
    });
    const [apiKeysLoading, setApiKeysLoading] = useState(false);
    const [apiKeysSaving, setApiKeysSaving] = useState(false);

    // Live API Key Health & Balance State
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [apiStatusResults, setApiStatusResults] = useState<{
        gemini?: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; details?: any };
        leonardo?: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; creditsRemaining?: number; subscriptionTokens?: number; details?: any };
        zernio?: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; details?: any };
    } | null>(null);

    // Password visibility toggles
    const [showGemini, setShowGemini] = useState(false);
    const [showLeonardo, setShowLeonardo] = useState(false);
    const [showZernio, setShowZernio] = useState(false);

    // Fetch API keys
    const fetchApiKeys = async () => {
        setApiKeysLoading(true);
        try {
            const { data } = await api.get("/api/auth/api-keys");
            setGeminiKey(data.geminiApiKey || '');
            setLeonardoKey(data.leonardoApiKey || '');
            setZernioKey(data.zernioApiKey || '');
            setSystemKeys({
                hasSystemGemini: !!data.hasSystemGemini,
                hasSystemLeonardo: !!data.hasSystemLeonardo,
                hasSystemZernio: !!data.hasSystemZernio
            });
            // Automatically check live status on load
            checkLiveApiKeys(data.geminiApiKey, data.leonardoApiKey, data.zernioApiKey);
        } catch (error: any) {
            console.error("Failed to load API keys", error);
        } finally {
            setApiKeysLoading(false);
        }
    };

    const checkLiveApiKeys = async (gKey?: string, lKey?: string, zKey?: string) => {
        setCheckingStatus(true);
        try {
            const { data } = await api.post("/api/auth/api-keys/check-status", {
                geminiApiKey: gKey !== undefined ? gKey : geminiKey,
                leonardoApiKey: lKey !== undefined ? lKey : leonardoKey,
                zernioApiKey: zKey !== undefined ? zKey : zernioKey,
            });

            if (data?.results) {
                setApiStatusResults(data.results);
            }
        } catch (err) {
            console.error("Failed to inspect API key live balance", err);
        } finally {
            setCheckingStatus(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'apikeys') {
            fetchApiKeys();
        }
    }, [activeTab]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setProfileLoading(true);
        try {
            const { data } = await api.put("/api/auth/profile", {
                name: name.trim(),
                avatarUrl: avatarBg
            });
            updateUser({ name: data.name, avatarUrl: data.avatarUrl });
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to update profile");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);
        try {
            await api.put("/api/auth/change-password", {
                currentPassword,
                newPassword
            });
            toast.success("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSaveApiKeys = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiKeysSaving(true);
        try {
            const { data } = await api.put("/api/auth/api-keys", {
                geminiApiKey: geminiKey,
                leonardoApiKey: leonardoKey,
                zernioApiKey: zernioKey
            });
            toast.success("API keys saved securely!");
            updateUser({ hasCustomGeminiKey: !!data.isUnlimited });
            refreshCredits();
            checkLiveApiKeys(geminiKey, leonardoKey, zernioKey);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message || "Failed to save API keys");
        } finally {
            setApiKeysSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your profile details, API keys, and security preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all shrink-0 ${
                        activeTab === 'profile'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <UserIcon className="size-4" />
                    Profile Details
                </button>

                <button
                    onClick={() => setActiveTab('apikeys')}
                    className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all shrink-0 ${
                        activeTab === 'apikeys'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <KeyIcon className="size-4" />
                    API Keys & Balance
                </button>

                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all shrink-0 ${
                        activeTab === 'security'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <LockIcon className="size-4" />
                    Security & Password
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <form onSubmit={handleProfileUpdate} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
                        {/* Avatar Customizer */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Avatar Accent</label>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className={`size-14 rounded-2xl bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white text-xl font-bold shadow-sm ring-2 ring-offset-2 ring-red-500/20`}>
                                    {name ? name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {AVATAR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => setAvatarBg(opt.bg)}
                                            className={`size-8 rounded-full bg-gradient-to-br ${opt.bg} transition-transform ${avatarBg === opt.bg ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                            title={opt.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User info fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-red-500 focus:outline-none transition"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                                />
                                <span className="text-[11px] text-slate-400 mt-1 block">Email cannot be modified directly.</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                            >
                                {profileLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'apikeys' && (
                <div className="space-y-6">
                    {/* Header Notification */}
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex items-start justify-between gap-4 text-blue-900 text-xs">
                        <div className="flex items-start gap-3.5">
                            <InfoIcon className="size-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-1 leading-relaxed">
                                <span className="font-semibold text-blue-950 text-sm block">Live API Keys Health & Quota Inspector</span>
                                <p className="text-blue-800">
                                    You can check remaining credits, rate limits, and live connection status for your online API keys in real time.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => checkLiveApiKeys(geminiKey, leonardoKey, zernioKey)}
                            disabled={checkingStatus}
                            className="inline-flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-xs shrink-0"
                        >
                            <RefreshCwIcon className={`size-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                            {checkingStatus ? "Checking Live..." : "Refresh Live Balance"}
                        </button>
                    </div>

                    {apiKeysLoading ? (
                        <div className="p-12 flex justify-center items-center bg-white rounded-2xl border border-slate-200">
                            <Loader2Icon className="size-6 text-red-500 animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSaveApiKeys} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-8">
                            {/* 1. Google Gemini API Key */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="size-4 text-purple-500" />
                                        <label className="text-sm font-semibold text-slate-800">Google Gemini API Key</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {geminiKey ? (
                                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                                                Custom Key (Unlimited Mode)
                                            </span>
                                        ) : systemKeys.hasSystemGemini ? (
                                            <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                                                System Default Key
                                            </span>
                                        ) : (
                                            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                                Not Configured
                                            </span>
                                        )}
                                        <a
                                            href="https://aistudio.google.com/app/apikey"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium ml-1"
                                        >
                                            Get Free Key <ExternalLinkIcon className="size-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showGemini ? "text" : "password"}
                                        value={geminiKey}
                                        onChange={(e) => setGeminiKey(e.target.value)}
                                        placeholder="AIzaSy... (leave blank to use system key)"
                                        className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:border-red-500 focus:outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowGemini(!showGemini)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        title={showGemini ? "Hide Key" : "Show Key"}
                                    >
                                        {showGemini ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                    </button>
                                </div>

                                {/* Live Gemini Inspection Status Card */}
                                {apiStatusResults?.gemini && (
                                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                                        apiStatusResults.gemini.status === 'ACTIVE'
                                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                                            : apiStatusResults.gemini.status === 'EXHAUSTED'
                                            ? 'bg-red-50 border-red-200 text-red-800'
                                            : 'bg-amber-50 border-amber-200 text-amber-800'
                                    }`}>
                                        {apiStatusResults.gemini.status === 'ACTIVE' ? (
                                            <CheckCircle2Icon className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                        ) : apiStatusResults.gemini.status === 'EXHAUSTED' ? (
                                            <AlertTriangleIcon className="size-4 text-red-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <InfoIcon className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <span className="font-semibold block">{apiStatusResults.gemini.message}</span>
                                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                                                Powers Gemini 2.5 Flash post composition, repurposing, and 30-day campaigns.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Leonardo.ai API Key */}
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="size-4 text-pink-500" />
                                        <label className="text-sm font-semibold text-slate-800">Leonardo.ai API Key</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {leonardoKey ? (
                                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                                Custom Key Active
                                            </span>
                                        ) : systemKeys.hasSystemLeonardo ? (
                                            <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                                                System Default Key
                                            </span>
                                        ) : (
                                            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                                Not Configured
                                            </span>
                                        )}
                                        <a
                                            href="https://app.leonardo.ai/api-access"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium ml-1"
                                        >
                                            Get API Key <ExternalLinkIcon className="size-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showLeonardo ? "text" : "password"}
                                        value={leonardoKey}
                                        onChange={(e) => setLeonardoKey(e.target.value)}
                                        placeholder="a4c000bf-... (leave blank to use system key)"
                                        className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:border-red-500 focus:outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLeonardo(!showLeonardo)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        title={showLeonardo ? "Hide Key" : "Show Key"}
                                    >
                                        {showLeonardo ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                    </button>
                                </div>

                                {/* Live Leonardo Token Inspection Status Card */}
                                {apiStatusResults?.leonardo && (
                                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                                        apiStatusResults.leonardo.status === 'ACTIVE'
                                            ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                                            : apiStatusResults.leonardo.status === 'EXHAUSTED'
                                            ? 'bg-red-50 border-red-200 text-red-800'
                                            : 'bg-amber-50 border-amber-200 text-amber-800'
                                    }`}>
                                        {apiStatusResults.leonardo.status === 'ACTIVE' ? (
                                            <ZapIcon className="size-4 text-purple-600 shrink-0 mt-0.5" />
                                        ) : apiStatusResults.leonardo.status === 'EXHAUSTED' ? (
                                            <XCircleIcon className="size-4 text-red-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <InfoIcon className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <span className="font-semibold block">{apiStatusResults.leonardo.message}</span>
                                            {apiStatusResults.leonardo.creditsRemaining !== undefined && (
                                                <span className="text-[11px] text-purple-700 mt-0.5 block">
                                                    Live API Balance: <strong>{apiStatusResults.leonardo.creditsRemaining} API Credits</strong> available for HD Image Generation.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Zernio API Key */}
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <KeyIcon className="size-4 text-blue-500" />
                                        <label className="text-sm font-semibold text-slate-800">Zernio API Key</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {zernioKey ? (
                                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                                Custom Key Active
                                            </span>
                                        ) : systemKeys.hasSystemZernio ? (
                                            <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                                                System Default Key
                                            </span>
                                        ) : (
                                            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                                Not Configured
                                            </span>
                                        )}
                                        <a
                                            href="https://zernio.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium ml-1"
                                        >
                                            Zernio Portal <ExternalLinkIcon className="size-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showZernio ? "text" : "password"}
                                        value={zernioKey}
                                        onChange={(e) => setZernioKey(e.target.value)}
                                        placeholder="sk_3d34b10... (leave blank to use system key)"
                                        className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:border-red-500 focus:outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowZernio(!showZernio)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        title={showZernio ? "Hide Key" : "Show Key"}
                                    >
                                        {showZernio ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                    </button>
                                </div>

                                {/* Live Zernio Inspection Status Card */}
                                {apiStatusResults?.zernio && (
                                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                                        apiStatusResults.zernio.status === 'ACTIVE'
                                            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                                            : 'bg-amber-50 border-amber-200 text-amber-800'
                                    }`}>
                                        <CheckCircle2Icon className="size-4 text-blue-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="font-semibold block">{apiStatusResults.zernio.message}</span>
                                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                                                Manages OAuth connections and background scheduler dispatch.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={apiKeysSaving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-50 shadow-sm"
                                >
                                    {apiKeysSaving ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                                    Save API Keys
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-red-500 focus:outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-red-500 focus:outline-none transition"
                                placeholder="Minimum 6 characters"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-red-500 focus:outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-start pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                        >
                            {passwordLoading ? <Loader2Icon className="size-4 animate-spin" /> : <LockIcon className="size-4" />}
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Settings;
