import mongoose from "mongoose";

export interface ICapturedLead {
    username: string;
    platform: string;
    commentText: string;
    dmSent: boolean;
    dmSentAt?: Date;
    createdAt: Date;
}

const LeadMagnetSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        offerTopic: { type: String },
        triggerKeywords: [{ type: String, required: true }],
        dmMessage: { type: String, required: true },
        publicReplies: [{ type: String }],
        postCaption: { type: String },
        resourceLink: { type: String },
        platform: {
            type: String,
            enum: ["instagram", "linkedin", "twitter", "facebook", "all"],
            default: "all",
        },
        status: {
            type: String,
            enum: ["active", "paused", "draft"],
            default: "active",
        },
        leadsCount: { type: Number, default: 0 },
        leads: [
            {
                username: { type: String, required: true },
                platform: { type: String, default: "instagram" },
                commentText: { type: String },
                dmSent: { type: Boolean, default: true },
                dmSentAt: { type: Date, default: Date.now },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export const LeadMagnet = mongoose.model("LeadMagnet", LeadMagnetSchema);
