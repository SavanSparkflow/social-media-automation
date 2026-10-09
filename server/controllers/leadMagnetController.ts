import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { LeadMagnet } from "../models/LeadMagnet.js";
import { GoogleGenAI } from "@google/genai";
import { checkAndDeductAiCredits } from "./authController.js";

// AI Copilot to generate complete Lead Magnet Funnel Package
// POST /api/lead-magnets/ai-draft
export const aiDraftLeadMagnet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { offerTopic, targetAudience = "Social Media Followers", platform = "instagram", customKeyword } = req.body;

        if (!offerTopic || offerTopic.trim().length < 5) {
            res.status(400).json({ message: "Please provide a clear lead magnet topic or free resource description." });
            return;
        }

        const apikey = req.user?.geminiApiKey || process.env.GEMINI_API_KEY;
        if (!apikey) {
            res.status(400).json({
                isMissingKey: true,
                message: "Gemini API key is missing. Please configure it in Settings -> API Keys or add it to server/.env.",
            });
            return;
        }

        // Check & deduct 1 AI credit
        const creditCheck = await checkAndDeductAiCredits(req.user._id, 1);
        if (!creditCheck.allowed) {
            res.status(403).json({
                isQuotaExhausted: true,
                creditsRemaining: creditCheck.remaining,
                message: "⚠️ AI Generation Credits Exhausted (0 remaining). Please enter your free Google Gemini API Key in Settings -> API Keys for Unlimited Generations!",
            });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apikey });

        const prompt = `You are a world-class Direct Response Marketer and Growth Automation Expert specializing in "Comment-to-DM" viral social media funnels.
Create a complete, high-converting Lead Magnet Funnel for:
- Resource / Free Offer: "${offerTopic}"
- Target Audience: "${targetAudience}"
- Primary Platform: "${platform}"
${customKeyword ? `- User Preferred Trigger Keyword: "${customKeyword}"` : ""}

Generate a complete funnel package in valid JSON format only:
{
  "title": "Catchy short campaign title (e.g., Free Growth Blueprint Funnel)",
  "triggerKeywords": ["PRIMARY_KEYWORD", "KEYWORD2", "KEYWORD3"],
  "postCaption": "Viral post copy with strong hook, crisp value points, and a powerful Call-To-Action at the end instructing users to comment the trigger keyword below to receive the free resource via DM. Include 4-6 hashtags.",
  "publicReplies": [
    "Variation 1 of public reply to comment with enthusiasm and emoji (e.g., Sent it straight to your DM! Check your inbox 🚀)",
    "Variation 2 (e.g., Check your messages! Just dropped the link in your DM 🔥)",
    "Variation 3 (e.g., Sent over! Let me know if you get value from it 📥)",
    "Variation 4 (e.g., Delivered to your inbox! Happy reading ✨)"
  ],
  "dmMessage": "Friendly, personalized DM copy greeting the user, delivering the resource link [DOWNLOAD_LINK_HERE], and asking a polite engagement question. Keep it professional and warm."
}

Return ONLY valid JSON matching this schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawText = response.text || "";
        let funnelData: any = null;

        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                funnelData = JSON.parse(jsonMatch[0]);
            }
        } catch (err) {
            console.error("Lead Magnet AI JSON parse error:", err);
        }

        if (!funnelData) {
            const defaultKey = (customKeyword || "GUIDE").toUpperCase();
            funnelData = {
                title: `${offerTopic} Funnel`,
                triggerKeywords: [defaultKey, "PDF", "FREE"],
                postCaption: `Want the complete "${offerTopic}" for free? 🚀\n\nI just packaged our exact step-by-step blueprint into an easy-to-read PDF guide.\n\n👇 Comment "${defaultKey}" below and I'll DM you the direct download link instantly!`,
                publicReplies: [
                    `Sent straight to your DM! Check your inbox 🚀`,
                    `Check your messages! Just dropped the link in your DM 🔥`,
                    `Sent over! Let me know your thoughts after reading 📥`,
                    `Delivered to your inbox! Enjoy the guide ✨`,
                ],
                dmMessage: `Hey there! 👋 Here is your free "${offerTopic}" download link:\n\n🔗 [DOWNLOAD_LINK_HERE]\n\nHope this gives you massive value! Let me know if you have any questions.`,
            };
        }

        res.status(200).json({
            success: true,
            data: funnelData,
        });
    } catch (error: any) {
        console.error("Lead magnet AI draft error:", error);
        res.status(500).json({ message: error.message || "Failed to draft lead magnet." });
    }
};

// GET all Lead Magnets for user
// GET /api/lead-magnets
export const getLeadMagnets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const leadMagnets = await LeadMagnet.find({ userId: req.user._id }).sort({ createdAt: -1 });

        const totalLeads = leadMagnets.reduce((sum, item) => sum + (item.leads?.length || 0), 0);
        const activeCampaigns = leadMagnets.filter((item) => item.status === "active").length;

        res.status(200).json({
            leadMagnets,
            stats: {
                totalCampaigns: leadMagnets.length,
                activeCampaigns,
                totalLeads,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch lead magnets." });
    }
};

// CREATE new Lead Magnet
// POST /api/lead-magnets
export const createLeadMagnet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            title,
            offerTopic,
            triggerKeywords,
            dmMessage,
            publicReplies,
            postCaption,
            resourceLink,
            platform = "all",
            status = "active",
        } = req.body;

        if (!title || !dmMessage || !triggerKeywords || !triggerKeywords.length) {
            res.status(400).json({ message: "Title, Trigger Keywords, and DM Message are required." });
            return;
        }

        const formattedKeywords = (Array.isArray(triggerKeywords) ? triggerKeywords : [triggerKeywords])
            .map((k: string) => k.trim().toUpperCase())
            .filter(Boolean);

        const newLeadMagnet = await LeadMagnet.create({
            userId: req.user._id,
            title,
            offerTopic,
            triggerKeywords: formattedKeywords,
            dmMessage,
            publicReplies: publicReplies?.length ? publicReplies : ["Sent to your DM! Check your inbox 🚀"],
            postCaption,
            resourceLink,
            platform,
            status,
            leadsCount: 0,
            leads: [],
        });

        res.status(201).json({
            success: true,
            leadMagnet: newLeadMagnet,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to create lead magnet." });
    }
};

// UPDATE Lead Magnet
// PUT /api/lead-magnets/:id
export const updateLeadMagnet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.triggerKeywords) {
            updates.triggerKeywords = (Array.isArray(updates.triggerKeywords) ? updates.triggerKeywords : [updates.triggerKeywords])
                .map((k: string) => k.trim().toUpperCase())
                .filter(Boolean);
        }

        const updated = await LeadMagnet.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { $set: updates },
            { new: true }
        );

        if (!updated) {
            res.status(404).json({ message: "Lead Magnet campaign not found." });
            return;
        }

        res.status(200).json({ success: true, leadMagnet: updated });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to update lead magnet." });
    }
};

// DELETE Lead Magnet
// DELETE /api/lead-magnets/:id
export const deleteLeadMagnet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await LeadMagnet.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deleted) {
            res.status(404).json({ message: "Lead Magnet not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Campaign deleted successfully." });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to delete lead magnet." });
    }
};

// SIMULATE / TEST TRIGGER LEAD MAGNET
// POST /api/lead-magnets/:id/test-trigger
export const testTriggerLeadMagnet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { username = "@alex_growth", commentText = "GUIDE please!", platform = "instagram" } = req.body;

        const campaign = await LeadMagnet.findOne({ _id: id, userId: req.user._id });
        if (!campaign) {
            res.status(404).json({ message: "Lead Magnet not found." });
            return;
        }

        // Check if comment matches any trigger keyword
        const cleanComment = commentText.toUpperCase();
        const matched = campaign.triggerKeywords.some((k) => cleanComment.includes(k.toUpperCase()));

        if (!matched) {
            res.status(200).json({
                matched: false,
                message: `Comment did not match any trigger keyword (${campaign.triggerKeywords.join(", ")}). No DM sent.`,
            });
            return;
        }

        // Pick random public reply
        const replies = campaign.publicReplies?.length
            ? campaign.publicReplies
            : ["Sent to your DM! Check your inbox 🚀"];
        const selectedReply = replies[Math.floor(Math.random() * replies.length)];

        // Format personalized DM with resource link
        let customizedDm = campaign.dmMessage;
        if (campaign.resourceLink) {
            customizedDm = customizedDm.replace(/\[DOWNLOAD_LINK_HERE\]/g, campaign.resourceLink);
        }

        // Add lead to campaign leads list
        const cleanUsername = username.startsWith("@") ? username : `@${username}`;
        campaign.leads.unshift({
            username: cleanUsername,
            platform,
            commentText,
            dmSent: true,
            dmSentAt: new Date(),
            createdAt: new Date(),
        });
        campaign.leadsCount = campaign.leads.length;
        await campaign.save();

        res.status(200).json({
            matched: true,
            replySent: selectedReply,
            dmSent: customizedDm,
            lead: campaign.leads[0],
            totalLeads: campaign.leadsCount,
            message: `🎉 Automation Successful! Sent public reply and DM to ${cleanUsername}.`,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to simulate trigger." });
    }
};
