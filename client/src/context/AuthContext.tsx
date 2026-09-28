import React, { createContext } from "react";
import api from "../api/axios";

interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null)
    const [token, setToken] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (storedUser && storedUser !== "undefined" && storedToken) {
            try {
                setUser(JSON.parse(storedUser))
                setToken(storedToken)
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        setIsLoading(false)
    }, [])

    const login = (userData: User, newToken: string) => {
        setUser(userData)
        setToken(newToken)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", newToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    }

    const updateUser = (updatedData: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...updatedData };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        delete api.defaults.headers.common['Authorization']
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context;

}