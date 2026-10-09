import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { checkAndDeductAiCredits } from "./authController.js";
import { Post } from "../models/Post.js";

// POST /api/posts/campaign/generate-30-days
export const generate30DayCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            brandNiche,
            targetAudience,
            tone = "Professional & Engaging",
            platforms = ["linkedin", "twitter"],
            postCount = 30,
            startDate,
            preferredTime = "10:00",
        } = req.body;

        if (!brandNiche || brandNiche.trim().length < 3) {
            res.status(400).json({ message: "Please enter your brand niche or product description." });
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

        // Check and deduct AI credits (Cost: 3 credits for a multi-day full campaign)
        const creditCheck = await checkAndDeductAiCredits(req.user._id, 3);
        if (!creditCheck.allowed) {
            res.status(403).json({
                isQuotaExhausted: true,
                creditsRemaining: creditCheck.remaining,
                message: "⚠️ AI Generation Credits Exhausted (0 remaining). Please enter your free Google Gemini API Key in Settings -> API Keys for Unlimited Generations!"
            });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apikey });

        const prompt = `You are a world-class Social Media Growth Director and Content Strategist.
Create a strategic, high-converting ${postCount}-day social media content campaign for the following brand:

Brand / Business: "${brandNiche}"
Target Audience: "${targetAudience || "Entrepreneurs, Creators, & Potential Customers"}"
Tone of Voice: "${tone}"
Target Platforms: ${Array.isArray(platforms) ? platforms.join(", ") : platforms}

Vary the content pillars across the days:
- Motivational & Mindset Hooks
- Actionable Frameworks & Step-by-Step Tips
- Industry Myths vs Facts
- Social Proof, Case Studies & Results
- Behind-the-Scenes & Storytelling
- Engagement Questions & Community Poll Prompts

Format the response as a valid JSON array of objects matching this exact structure:
[
  {
    "day": 1,
    "theme": "Monday Motivation & Industry Truth",
    "headline": "Why most fail at [Topic]",
    "content": "Full post copy with engaging line breaks, emojis, bullet points, and hashtags #tag1 #tag2",
    "imagePrompt": "A modern 3D illustration representing [Topic], vibrant lighting, 8k resolution"
  }
]

Generate exactly ${Math.min(Number(postCount) || 30, 30)} distinct, ready-to-publish days. Output ONLY the JSON array.`;

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawText = textResponse.text || "";
        let campaignDays: any[] = [];

        try {
            const jsonMatch = rawText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                campaignDays = JSON.parse(jsonMatch[0]);
            }
        } catch (jsonErr) {
            console.error("JSON parse error in 30-day campaign:", jsonErr);
        }

        // Calculate schedule dates starting from startDate (or tomorrow)
        const baseDate = startDate ? new Date(startDate) : new Date();
        if (!startDate) baseDate.setDate(baseDate.getDate() + 1);

        const mappedDays = campaignDays.map((item, idx) => {
            const dayDate = new Date(baseDate);
            dayDate.setDate(baseDate.getDate() + idx);
            const [hours, mins] = (preferredTime || "10:00").split(":");
            dayDate.setHours(Number(hours) || 10, Number(mins) || 0, 0, 0);

            return {
                day: item.day || idx + 1,
                theme: item.theme || `Day ${idx + 1} Strategy`,
                headline: item.headline || `Strategy for Day ${idx + 1}`,
                content: item.content || `Exciting insights about ${brandNiche}! #Growth #Strategy`,
                imagePrompt: item.imagePrompt || `3D render related to ${brandNiche}`,
                scheduledFor: dayDate.toISOString(),
                platforms: Array.isArray(platforms) && platforms.length > 0 ? platforms : ["linkedin", "twitter"],
            };
        });

        res.status(200).json({
            success: true,
            totalDays: mappedDays.length,
            campaign: mappedDays,
        });
    } catch (error: any) {
        console.error("30-day campaign error:", error);
        res.status(500).json({
            message: error.message || "Failed to generate 30-day campaign.",
        });
    }
};

// POST /api/posts/campaign/batch-schedule
export const batchScheduleCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { posts } = req.body;

        if (!Array.isArray(posts) || posts.length === 0) {
            res.status(400).json({ message: "No posts provided to schedule." });
            return;
        }

        const newPosts = posts.map((p) => ({
            user: req.user._id,
            content: p.content,
            platforms: Array.isArray(p.platforms) ? p.platforms : ["linkedin"],
            scheduledFor: new Date(p.scheduledFor),
            mediaUrl: p.mediaUrl || undefined,
            mediaType: p.mediaUrl ? "image" : undefined,
            status: "scheduled",
        }));

        const inserted = await Post.insertMany(newPosts);

        res.status(201).json({
            message: `Successfully scheduled ${inserted.length} posts for the month!`,
            scheduledCount: inserted.length,
            posts: inserted,
        });
    } catch (error: any) {
        console.error("Batch schedule error:", error);
        res.status(500).json({
            message: error.message || "Failed to batch schedule campaign.",
        });
    }
};
