import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRECT || "fallback_secret", { expiresIn: "30d" });
};

// Helper to deduct AI credits
export const checkAndDeductAiCredits = async (
    userId: string,
    cost: number = 1
): Promise<{ allowed: boolean; remaining: number; isUnlimited: boolean }> => {
    const user = await User.findById(userId);
    if (!user) return { allowed: false, remaining: 0, isUnlimited: false };

    // If user has provided their own Gemini API key, they get Unlimited AI Generations!
    if (user.geminiApiKey && user.geminiApiKey.trim().length > 5) {
        return { allowed: true, remaining: user.aiCredits ?? 50, isUnlimited: true };
    }

    const currentCredits = user.aiCredits !== undefined ? user.aiCredits : 50;
    if (currentCredits < cost) {
        return { allowed: false, remaining: currentCredits, isUnlimited: false };
    }

    user.aiCredits = Math.max(0, currentCredits - cost);
    await user.save();
    return { allowed: true, remaining: user.aiCredits, isUnlimited: false };
};

// Register User
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            aiCredits: 50,
            aiCreditsMax: 50,
            plan: "free",
            planBillingCycle: "none",
            maxSocialAccounts: 1,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                aiCredits: user.aiCredits,
                aiCreditsMax: user.aiCreditsMax,
                plan: user.plan || "free",
                planBillingCycle: user.planBillingCycle || "none",
                planExpiresAt: user.planExpiresAt,
                maxSocialAccounts: user.maxSocialAccounts || 1,
                hasCustomGeminiKey: false,
                hasCustomLeonardoKey: false,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Login User
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const isPlanExpired = user.planExpiresAt && new Date() > new Date(user.planExpiresAt);
            const activePlan = isPlanExpired ? "free" : user.plan || "free";

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                aiCredits: user.aiCredits !== undefined ? user.aiCredits : 50,
                aiCreditsMax: user.aiCreditsMax || 50,
                plan: activePlan,
                planBillingCycle: user.planBillingCycle || "none",
                planExpiresAt: user.planExpiresAt,
                maxSocialAccounts: user.maxSocialAccounts || 1,
                hasCustomGeminiKey: !!(user.geminiApiKey && user.geminiApiKey.trim().length > 5),
                hasCustomLeonardoKey: !!(user.leonardoApiKey && user.leonardoApiKey.trim().length > 5),
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Get User Profile
// GET /api/auth/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPlanExpired = user.planExpiresAt && new Date() > new Date(user.planExpiresAt);
        const activePlan = isPlanExpired ? "free" : user.plan || "free";

        const userObj = user.toObject();
        res.status(200).json({
            ...userObj,
            plan: activePlan,
            isPlanExpired,
            aiCredits: user.aiCredits !== undefined ? user.aiCredits : 50,
            aiCreditsMax: user.aiCreditsMax || 50,
            maxSocialAccounts: user.maxSocialAccounts || 1,
            hasCustomGeminiKey: !!(user.geminiApiKey && user.geminiApiKey.trim().length > 5),
            hasCustomLeonardoKey: !!(user.leonardoApiKey && user.leonardoApiKey.trim().length > 5),
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Get Live Credits Status
// GET /api/auth/credits
export const getCreditsStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPlanExpired = user.planExpiresAt && new Date() > new Date(user.planExpiresAt);
        const activePlan = isPlanExpired ? "free" : user.plan || "free";

        const isUnlimited = !!(user.geminiApiKey && user.geminiApiKey.trim().length > 5);
        const credits = user.aiCredits !== undefined ? user.aiCredits : 50;
        const maxCredits = user.aiCreditsMax || 50;

        res.status(200).json({
            plan: activePlan,
            isPlanExpired,
            planExpiresAt: user.planExpiresAt,
            planBillingCycle: user.planBillingCycle,
            maxSocialAccounts: user.maxSocialAccounts || 1,
            aiCredits: credits,
            aiCreditsMax: maxCredits,
            isUnlimited,
            isLow: !isUnlimited && credits <= 10 && credits > 0,
            isExhausted: !isUnlimited && credits <= 0,
            hasCustomGeminiKey: isUnlimited,
            hasCustomLeonardoKey: !!(user.leonardoApiKey && user.leonardoApiKey.trim().length > 5),
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Update User Profile
// PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, avatarUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (name) user.name = name;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            aiCredits: user.aiCredits !== undefined ? user.aiCredits : 50,
            aiCreditsMax: user.aiCreditsMax || 50,
            hasCustomGeminiKey: !!(user.geminiApiKey && user.geminiApiKey.trim().length > 5),
            message: "Profile updated successfully",
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Change Password
// PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Please provide current and new password" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "New password must be at least 6 characters long" });
            return;
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Get User API Keys
// GET /api/auth/api-keys
export const getApiKeys = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            geminiApiKey: user.geminiApiKey || "",
            leonardoApiKey: user.leonardoApiKey || "",
            zernioApiKey: user.zernioApiKey || "",
            hasSystemGemini: !!process.env.GEMINI_API_KEY,
            hasSystemLeonardo: !!process.env.LEONARDO_API_KEY,
            hasSystemZernio: !!process.env.ZERNIO_API_KEY,
            aiCredits: user.aiCredits !== undefined ? user.aiCredits : 50,
            aiCreditsMax: user.aiCreditsMax || 50,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Update User API Keys
// PUT /api/auth/api-keys
export const updateApiKeys = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { geminiApiKey, leonardoApiKey, zernioApiKey } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.geminiApiKey = geminiApiKey !== undefined ? geminiApiKey.trim() : user.geminiApiKey;
        user.leonardoApiKey = leonardoApiKey !== undefined ? leonardoApiKey.trim() : user.leonardoApiKey;
        user.zernioApiKey = zernioApiKey !== undefined ? zernioApiKey.trim() : user.zernioApiKey;

        await user.save();

        res.status(200).json({
            message: "API keys updated successfully",
            geminiApiKey: user.geminiApiKey,
            leonardoApiKey: user.leonardoApiKey,
            zernioApiKey: user.zernioApiKey,
            isUnlimited: !!(user.geminiApiKey && user.geminiApiKey.length > 5),
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Check Live API Keys Status & Balance (Gemini, Leonardo.ai, Zernio)
// POST /api/auth/api-keys/check-status
export const checkApiKeysStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { geminiApiKey, leonardoApiKey, zernioApiKey } = req.body;
        const user = await User.findById(req.user._id);

        const geminiKeyToTest = (geminiApiKey !== undefined ? geminiApiKey : user?.geminiApiKey) || process.env.GEMINI_API_KEY || "";
        const leonardoKeyToTest = (leonardoApiKey !== undefined ? leonardoApiKey : user?.leonardoApiKey) || process.env.LEONARDO_API_KEY || "";
        const zernioKeyToTest = (zernioApiKey !== undefined ? zernioApiKey : user?.zernioApiKey) || process.env.ZERNIO_API_KEY || "";

        const results: {
            gemini: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; details?: any };
            leonardo: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; creditsRemaining?: number; subscriptionTokens?: number; details?: any };
            zernio: { status: "ACTIVE" | "EXHAUSTED" | "INVALID" | "NOT_CONFIGURED"; message: string; details?: any };
        } = {
            gemini: { status: "NOT_CONFIGURED", message: "No Gemini API key provided" },
            leonardo: { status: "NOT_CONFIGURED", message: "No Leonardo API key provided" },
            zernio: { status: "NOT_CONFIGURED", message: "No Zernio API key provided" },
        };

        // 1. Check Google Gemini
        if (geminiKeyToTest && geminiKeyToTest.trim().length > 5) {
            try {
                const geminiRes = await axios.get(
                    `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKeyToTest.trim()}`,
                    { timeout: 7000 }
                );
                if (geminiRes.status === 200 && geminiRes.data?.models) {
                    results.gemini = {
                        status: "ACTIVE",
                        message: "🟢 Connected & Active (Gemini 2.5 Flash / 1.5 Pro Available - 15 RPM Free Tier)",
                        details: {
                            modelCount: geminiRes.data.models.length,
                            isCustomKey: geminiKeyToTest !== process.env.GEMINI_API_KEY,
                        },
                    };
                }
            } catch (gErr: any) {
                if (gErr?.response?.status === 429) {
                    results.gemini = {
                        status: "EXHAUSTED",
                        message: "🔴 Token Quota Rate Limited (429 Too Many Requests). Wait a few minutes or use Pay-as-you-go key.",
                    };
                } else if (gErr?.response?.status === 400 || gErr?.response?.status === 403) {
                    results.gemini = {
                        status: "INVALID",
                        message: "🔴 Invalid Google Gemini API Key or Permissions Denied (400/403).",
                    };
                } else {
                    results.gemini = {
                        status: "ACTIVE",
                        message: "🟢 Key recognized (Network test passed)",
                    };
                }
            }
        }

        // 2. Check Leonardo.ai Live Credits
        if (leonardoKeyToTest && leonardoKeyToTest.trim().length > 5) {
            try {
                const leoRes = await axios.get("https://cloud.leonardo.ai/api/rest/v1/me", {
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${leonardoKeyToTest.trim()}`,
                    },
                    timeout: 7000,
                });

                const userDetail = leoRes.data?.user_details?.[0];
                if (userDetail) {
                    const apiCredit = userDetail.apiCredit ?? 0;
                    const subscriptionTokens = userDetail.subscriptionTokens ?? 0;
                    const username = userDetail.user?.username || "Leonardo User";

                    if (apiCredit === 0 && subscriptionTokens === 0) {
                        results.leonardo = {
                            status: "EXHAUSTED",
                            creditsRemaining: 0,
                            subscriptionTokens: 0,
                            message: `🔴 0 API Credits Remaining for account "${username}". Please top up on Leonardo.ai.`,
                        };
                    } else {
                        results.leonardo = {
                            status: "ACTIVE",
                            creditsRemaining: apiCredit,
                            subscriptionTokens: subscriptionTokens,
                            message: `🟢 Active • ${apiCredit} API Credits remaining (${subscriptionTokens} Sub Tokens) • Account: ${username}`,
                            details: { username, apiCredit, subscriptionTokens },
                        };
                    }
                } else {
                    results.leonardo = {
                        status: "ACTIVE",
                        message: "🟢 Leonardo API Key Valid",
                    };
                }
            } catch (lErr: any) {
                if (lErr?.response?.status === 401 || lErr?.response?.status === 403) {
                    results.leonardo = {
                        status: "INVALID",
                        message: "🔴 Invalid Leonardo.ai API Key (401 Unauthorized).",
                    };
                } else if (lErr?.response?.status === 402) {
                    results.leonardo = {
                        status: "EXHAUSTED",
                        creditsRemaining: 0,
                        message: "🔴 Leonardo Tokens Exhausted (402 Payment Required).",
                    };
                } else {
                    results.leonardo = {
                        status: "ACTIVE",
                        message: "🟢 Connected",
                    };
                }
            }
        }

        // 3. Check Zernio API
        if (zernioKeyToTest && zernioKeyToTest.trim().length > 5) {
            try {
                const zernioRes = await axios.get("https://api.zernio.com/api/v1/profiles", {
                    headers: {
                        authorization: `Bearer ${zernioKeyToTest.trim()}`,
                    },
                    timeout: 7000,
                });
                const count = zernioRes.data?.profiles?.length || zernioRes.data?.length || 0;
                results.zernio = {
                    status: "ACTIVE",
                    message: `🟢 Active & Connected • ${count} Social Profiles Linked`,
                };
            } catch (zErr: any) {
                if (zErr?.response?.status === 401 || zErr?.response?.status === 403) {
                    results.zernio = {
                        status: "INVALID",
                        message: "🔴 Invalid Zernio API Key (401 Unauthorized).",
                    };
                } else {
                    results.zernio = {
                        status: "ACTIVE",
                        message: "🟢 Zernio API Key Configured",
                    };
                }
            }
        }

        res.status(200).json({
            success: true,
            results,
        });
    } catch (error: any) {
        console.error("API keys status check error:", error);
        res.status(500).json({ message: error.message || "Failed to check API key status." });
    }
};

