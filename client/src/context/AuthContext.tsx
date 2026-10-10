import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export type PlanType = "free" | "pro" | "agency";

export interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    aiCredits?: number;
    aiCreditsMax?: number;
    plan?: PlanType;
    planBillingCycle?: "monthly" | "yearly" | "none";
    planExpiresAt?: string;
    maxSocialAccounts?: number;
    hasCustomGeminiKey?: boolean;
    hasCustomLeonardoKey?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    refreshCredits: () => Promise<void>;
    refreshSubscription: () => Promise<void>;
    isAuthenticated: boolean;
    isUnlimited: boolean;
    aiCredits: number;
    aiCreditsMax: number;
    plan: PlanType;
    isPro: boolean;
    isAgency: boolean;
    hasFeatureAccess: (feature: "repurpose" | "campaign" | "competitor" | "lead-magnet") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aiCredits, setAiCredits] = useState<number>(50);
    const [aiCreditsMax, setAiCreditsMax] = useState<number>(50);
    const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
    const [plan, setPlan] = useState<PlanType>("free");

    const refreshCredits = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        try {
            const { data } = await api.get("/api/auth/credits");
            if (data) {
                setAiCredits(data.aiCredits ?? 50);
                setAiCreditsMax(data.aiCreditsMax ?? 50);
                setIsUnlimited(!!data.isUnlimited);
                if (data.plan) setPlan(data.plan);
            }
        } catch {
            // silent catch
        }
    }, []);

    const refreshSubscription = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        try {
            const { data } = await api.get("/api/payment/status");
            if (data) {
                setPlan(data.plan || "free");
                setAiCredits(data.aiCredits ?? 50);
                setAiCreditsMax(data.aiCreditsMax ?? 50);
                setIsUnlimited(!!data.isUnlimited);
                setUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              plan: data.plan || "free",
                              planExpiresAt: data.planExpiresAt,
                              planBillingCycle: data.planBillingCycle,
                              maxSocialAccounts: data.maxSocialAccounts,
                              aiCredits: data.aiCredits,
                              aiCreditsMax: data.aiCreditsMax,
                          }
                        : null
                );
            }
        } catch {
            // silent catch
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedUser !== "undefined" && storedToken) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setToken(storedToken);
                setAiCredits(parsed.aiCredits !== undefined ? parsed.aiCredits : 50);
                setAiCreditsMax(parsed.aiCreditsMax || 50);
                setIsUnlimited(!!parsed.hasCustomGeminiKey);
                setPlan(parsed.plan || "free");
                api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
                refreshCredits();
                refreshSubscription();
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        setIsLoading(false);
    }, [refreshCredits, refreshSubscription]);

    const login = (userData: User, newToken: string) => {
        setUser(userData);
        setToken(newToken);
        setAiCredits(userData.aiCredits !== undefined ? userData.aiCredits : 50);
        setAiCreditsMax(userData.aiCreditsMax || 50);
        setIsUnlimited(!!userData.hasCustomGeminiKey);
        setPlan(userData.plan || "free");
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        refreshCredits();
        refreshSubscription();
    };

    const updateUser = (updatedData: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...updatedData };
            if (updatedData.aiCredits !== undefined) setAiCredits(updatedData.aiCredits);
            if (updatedData.aiCreditsMax !== undefined) setAiCreditsMax(updatedData.aiCreditsMax);
            if (updatedData.hasCustomGeminiKey !== undefined) setIsUnlimited(updatedData.hasCustomGeminiKey);
            if (updatedData.plan !== undefined) setPlan(updatedData.plan);
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAiCredits(50);
        setAiCreditsMax(50);
        setIsUnlimited(false);
        setPlan("free");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    };

    const isPro = plan === "pro" || plan === "agency";
    const isAgency = plan === "agency";

    // Feature gating check
    const hasFeatureAccess = (feature: "repurpose" | "campaign" | "competitor" | "lead-magnet"): boolean => {
        if (plan === "agency") return true;
        if (plan === "pro") {
            return feature === "repurpose" || feature === "campaign" || feature === "competitor";
        }
        return false; // Free plan has access to composer, scheduler, accounts only
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                updateUser,
                refreshCredits,
                refreshSubscription,
                isAuthenticated: !!token,
                isUnlimited,
                aiCredits,
                aiCreditsMax,
                plan,
                isPro,
                isAgency,
                hasFeatureAccess,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};