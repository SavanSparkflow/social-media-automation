import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { UserIcon, LockIcon, ShieldCheckIcon, SaveIcon, Loader2Icon, CheckCircle2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVATAR_OPTIONS = [
    { label: "Coral Sunset", bg: "from-red-500 to-pink-500" },
    { label: "Ocean Breeze", bg: "from-blue-500 to-cyan-500" },
    { label: "Purple Velvet", bg: "from-purple-500 to-indigo-500" },
    { label: "Emerald Spark", bg: "from-emerald-500 to-teal-500" },
    { label: "Amber Glow", bg: "from-amber-500 to-orange-500" },
];

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // Profile state
    const [name, setName] = useState(user?.name || '');
    const [avatarBg, setAvatarBg] = useState(user?.avatarUrl || AVATAR_OPTIONS[0].bg);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

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

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your profile details, avatar, and security preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all ${
                        activeTab === 'profile'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <UserIcon className="size-4" />
                    Profile Details
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all ${
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
                            <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Avatar Style</label>
                            <div className="flex items-center gap-6">
                                <div className={`size-16 rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                                    {name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {AVATAR_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.label}
                                                type="button"
                                                onClick={() => setAvatarBg(opt.bg)}
                                                className={`size-8 rounded-full bg-gradient-to-br ${opt.bg} flex items-center justify-center transition-transform ${
                                                    avatarBg === opt.bg ? 'ring-2 ring-red-500 ring-offset-2 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                                                }`}
                                                title={opt.label}
                                            >
                                                {avatarBg === opt.bg && <CheckCircle2Icon className="size-4 text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">Pick a gradient color scheme for your profile avatar.</p>
                                </div>
                            </div>
                        </div>

                        {/* Name & Email Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
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

                    {/* Quick Access Card */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-500 text-white rounded-xl">
                                <ShieldCheckIcon className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">Connected Social Accounts</h3>
                                <p className="text-xs text-slate-500">Manage OAuth credentials and sync platforms.</p>
                            </div>
                        </div>
                        <Link
                            to="/accounts"
                            className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium transition shadow-xs"
                        >
                            View Accounts &rarr;
                        </Link>
                    </div>
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
