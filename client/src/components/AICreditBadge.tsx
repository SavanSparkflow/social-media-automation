import { Link } from "react-router-dom";
import { Zap, AlertTriangle, ShieldAlert, Sparkles, Key, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AICreditBadge({ compact = false }: { compact?: boolean }) {
    const { aiCredits, aiCreditsMax, isUnlimited } = useAuth();

    if (isUnlimited) {
        return (
            <div className={`inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold ${compact ? "text-[11px] py-1" : ""}`}>
                <Sparkles className="size-3.5 text-emerald-500" />
                <span>Unlimited AI Mode (Custom Key Active)</span>
            </div>
        );
    }

    const percentage = Math.min(100, Math.max(0, (aiCredits / (aiCreditsMax || 50)) * 100));
    const isExhausted = aiCredits <= 0;
    const isLow = aiCredits <= 10 && !isExhausted;

    if (compact) {
        return (
            <Link
                to="/settings"
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isExhausted
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-pulse"
                        : isLow
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
                title="Click to add custom API key in Settings"
            >
                <Zap className={`size-3 ${isExhausted ? "text-red-500" : isLow ? "text-amber-500" : "text-slate-500"}`} />
                <span>
                    AI Credits: <strong>{aiCredits}</strong> / {aiCreditsMax}
                </span>
            </Link>
        );
    }

    return (
        <div className="w-full">
            {/* Status Banner */}
            {isExhausted ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-2xs">
                    <div className="flex items-start gap-3">
                        <div className="size-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldAlert className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-red-800">
                                🚫 AI Generation Credits Exhausted (0 / {aiCreditsMax} Remaining)
                            </h4>
                            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
                                You have used all free trial AI credits. Add your free Google Gemini API Key in Settings to unlock <strong>Unlimited Generations</strong>.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
                    >
                        <Key className="size-3.5" /> Add Gemini Key in Settings
                    </Link>
                </div>
            ) : isLow ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-2xs">
                    <div className="flex items-start gap-3">
                        <div className="size-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">
                                ⚠️ Low AI Credits Alert: {aiCredits} Credits Remaining
                            </h4>
                            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                                Your free AI tokens are running low. Avoid interruptions by adding your personal Gemini API Key for unlimited usage.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
                    >
                        <Key className="size-3.5" /> Upgrade to Unlimited Key
                    </Link>
                </div>
            ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                            <Zap className="size-4" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-800">
                                AI Credits: {aiCredits} / {aiCreditsMax} Available
                            </div>
                            <div className="w-36 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
                    >
                        Unlimited Key Mode <ExternalLink className="size-3" />
                    </Link>
                </div>
            )}
        </div>
    );
}
