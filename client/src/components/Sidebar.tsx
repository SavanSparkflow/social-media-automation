import { useState } from "react";
import {
    CalendarDaysIcon,
    CalendarRangeIcon,
    BrainCircuitIcon,
    Gift,
    LayoutDashboard,
    LogOutIcon,
    RepeatIcon,
    SettingsIcon,
    UserIcon,
    Wand2Icon,
    Crown,
    Zap,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AICreditBadge from "./AICreditBadge";
import UpgradePlanModal from "./UpgradePlanModal";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) => {
    const { logout, user, plan } = useAuth();
    const location = useLocation();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", planBadge: null },
        { name: "Accounts", icon: UserIcon, path: "/accounts", planBadge: null },
        { name: "Scheduler", icon: CalendarDaysIcon, path: "/schedule", planBadge: null },
        { name: "AI Composer", icon: Wand2Icon, path: "/ai-composer", planBadge: null },
        { name: "Repurposer", icon: RepeatIcon, path: "/repurpose", planBadge: plan === "free" ? "PRO" : null },
        { name: "30D Campaign", icon: CalendarRangeIcon, path: "/campaign", planBadge: plan === "free" ? "PRO" : null },
        { name: "Viral Decoder", icon: BrainCircuitIcon, path: "/competitor-decoder", planBadge: plan === "free" ? "PRO" : null },
        { name: "Lead Magnets", icon: Gift, path: "/lead-magnets", planBadge: plan !== "agency" ? "AGENCY" : null },
        { name: "Settings", icon: SettingsIcon, path: "/settings", planBadge: null },
    ];

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="p-6 pb-3">
                    <div className="text-xl tracking-tight text-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold">
                            <img src="/logo.svg" alt="logo" className="size-6" />
                            Scheduler
                        </div>
                        {/* Active Plan Badge */}
                        <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                plan === "agency"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : plan === "pro"
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                        >
                            {plan}
                        </span>
                    </div>
                </div>

                {/* Nav section label */}
                <div className="px-6 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Menu</span>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === "/dashboard"}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 border ${
                                    isActive
                                        ? "bg-red-50 text-red-600 border-red-100 font-semibold shadow-2xs"
                                        : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-900"
                                }`}
                            >
                                <item.icon
                                    className={`size-4.5 shrink-0 ${isActive ? "text-red-500" : "text-slate-400"}`}
                                />
                                <span>{item.name}</span>

                                {item.planBadge && (
                                    <span
                                        className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                            item.planBadge === "AGENCY"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.planBadge}
                                    </span>
                                )}

                                {isActive && !item.planBadge && (
                                    <span className="ml-auto w-1.5 h-4 rounded-full bg-red-500" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Upgrade Plan Callout (if not on Agency plan) */}
                {plan !== "agency" && (
                    <div className="p-3 mx-3 my-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white text-xs shadow-xs space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5">
                            {plan === "free" ? <Zap className="size-3.5" /> : <Crown className="size-3.5" />}
                            <span>{plan === "free" ? "Upgrade to Pro" : "Upgrade to Agency"}</span>
                        </div>
                        <p className="text-[11px] text-rose-100 leading-tight">
                            {plan === "free"
                                ? "Unlock 30D Autopilot, Repurposer & 500 AI credits."
                                : "Unlock Lead Magnet Funnels & Unlimited Accounts."}
                        </p>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="w-full mt-1 py-1.5 bg-white hover:bg-rose-50 text-red-600 font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                            ⚡ Upgrade with Razorpay
                        </button>
                    </div>
                )}

                {/* AI Credits Widget in Sidebar */}
                <div className="px-3 py-1.5">
                    <AICreditBadge compact={true} />
                </div>

                {/* user footer */}
                <div className="p-3 border-t border-slate-100">
                    <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                        <div
                            className={`size-8 rounded-full bg-gradient-to-br ${
                                user?.avatarUrl || "from-red-400 to-pink-500"
                            } flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs`}
                        >
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-red-600 transition-colors">
                                {user?.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="mt-1 flex items-center gap-2 px-3 py-1.5 w-full rounded-lg text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                    >
                        <LogOutIcon className="size-3.5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Upgrade Modal */}
            <UpgradePlanModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                highlightPlan={plan === "free" ? "pro" : "agency"}
            />
        </>
    );
};

export default Sidebar;