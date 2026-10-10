import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        avatarUrl: { type: String },
        zernioProfileId: { type: String },
        geminiApiKey: { type: String },
        leonardoApiKey: { type: String },
        zernioApiKey: { type: String },
        aiCredits: { type: Number, default: 50 },
        aiCreditsMax: { type: Number, default: 50 },
        plan: {
            type: String,
            enum: ["free", "pro", "agency"],
            default: "free",
        },
        planBillingCycle: {
            type: String,
            enum: ["monthly", "yearly", "none"],
            default: "none",
        },
        planExpiresAt: { type: Date },
        maxSocialAccounts: { type: Number, default: 1 },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);