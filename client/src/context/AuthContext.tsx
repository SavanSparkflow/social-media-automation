import React, { createContext, useCallback } from "react";
import api from "../api/axios";

export interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    aiCredits?: number;
    aiCreditsMax?: number;
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
    isAuthenticated: boolean;
    isUnlimited: boolean;
    aiCredits: number;
    aiCreditsMax: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [aiCredits, setAiCredits] = React.useState<number>(50);
    const [aiCreditsMax, setAiCreditsMax] = React.useState<number>(50);
    const [isUnlimited, setIsUnlimited] = React.useState<boolean>(false);

    const refreshCredits = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        try {
            const { data } = await api.get("/api/auth/credits");
            if (data) {
                setAiCredits(data.aiCredits ?? 50);
                setAiCreditsMax(data.aiCreditsMax ?? 50);
                setIsUnlimited(!!data.isUnlimited);
            }
        } catch {
            // silent catch
        }
    }, []);

    React.useEffect(() => {
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
                api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
                refreshCredits();
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        setIsLoading(false);
    }, [refreshCredits]);

    const login = (userData: User, newToken: string) => {
        setUser(userData);
        setToken(newToken);
        setAiCredits(userData.aiCredits !== undefined ? userData.aiCredits : 50);
        setAiCreditsMax(userData.aiCreditsMax || 50);
        setIsUnlimited(!!userData.hasCustomGeminiKey);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        refreshCredits();
    };

    const updateUser = (updatedData: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...updatedData };
            if (updatedData.aiCredits !== undefined) setAiCredits(updatedData.aiCredits);
            if (updatedData.aiCreditsMax !== undefined) setAiCreditsMax(updatedData.aiCreditsMax);
            if (updatedData.hasCustomGeminiKey !== undefined) setIsUnlimited(updatedData.hasCustomGeminiKey);
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
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
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
                isAuthenticated: !!token,
                isUnlimited,
                aiCredits,
                aiCreditsMax,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};