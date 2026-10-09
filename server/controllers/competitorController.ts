import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { checkAndDeductAiCredits } from "./authController.js";
import axios from "axios";

// Helper to scrape post text from a web link
async function fetchPostContentFromUrl(url: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            timeout: 8000,
        });
        const html = String(response.data);
        const clean = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        return clean.slice(0, 4000);
    } catch {
        return "";
    }
}

// POST /api/posts/competitor/reverse-engineer
export const reverseEngineerCompetitorPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { viralContent, competitorUrl, userNiche, targetAudience, tone = "Engaging & Authoritative" } = req.body;

        let sourcePost = (viralContent || "").trim();

        if (!sourcePost && competitorUrl) {
            sourcePost = await fetchPostContentFromUrl(competitorUrl);
        }

        if (!sourcePost || sourcePost.length < 15) {
            res.status(400).json({
                message: "Please provide the viral post content or a valid post URL to reverse engineer.",
            });
            return;
        }

        if (!userNiche || userNiche.trim().length < 3) {
            res.status(400).json({
                message: "Please specify your own brand, niche, or topic so we can adapt the viral blueprint.",
            });
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

        // Check and deduct AI credits
        const creditCheck = await checkAndDeductAiCredits(req.user._id, 2);
        if (!creditCheck.allowed) {
            res.status(403).json({
                isQuotaExhausted: true,
                creditsRemaining: creditCheck.remaining,
                message: "⚠️ AI Generation Credits Exhausted (0 remaining). Please enter your free Google Gemini API Key in Settings -> API Keys for Unlimited Generations!"
            });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apikey });

        const prompt = `You are a legendary Social Media Growth Hacker and Behavioral Psychologist.
Analyze the following VIRAL post, decode why it succeeded, and generate 3 completely original variations adapted specifically for the user's business niche.

VIRAL POST TO DECONSTRUCT:
"""
${sourcePost}
"""

USER'S TARGET BRAND / NICHE:
"${userNiche}"
Target Audience: "${targetAudience || "Industry Professionals & Customers"}"
Tone: "${tone}"

OUTPUT REQUIREMENTS:
Output ONLY a valid JSON object matching this exact structure:
{
  "analysis": {
    "viralityScore": "95/100",
    "hookBreakdown": "Explain why the opening 1-2 lines grabbed immediate attention and stopped the scroll.",
    "psychologicalTriggers": [
      "Trigger 1 (e.g. Counter-intuitive curiosity)",
      "Trigger 2 (e.g. Vulnerability / Social Proof)",
      "Trigger 3 (e.g. Actionable FOMO)"
    ],
    "structureBlueprint": "Hook -> Problem Agitation -> Revelation / Twist -> 3 Actionable Bullets -> Engagement Question"
  },
  "adaptedVariations": [
    {
      "style": "High-Energy & Contrarian Hook",
      "headline": "Why everything you know about [Topic] is wrong",
      "content": "Full post copy tailored to user's niche with line breaks, emojis, bullet points, and hashtags",
      "imagePrompt": "Prompt for AI image generator"
    },
    {
      "style": "Storytelling & Vulnerable Lesson",
      "headline": "The biggest mistake I made in [Topic] so you don't have to",
      "content": "Full post copy with storytelling narrative and lessons learned",
      "imagePrompt": "Prompt for AI image generator"
    },
    {
      "style": "Actionable Framework / Step-by-Step",
      "headline": "A 4-step blueprint to achieve [Desired Outcome]",
      "content": "Full post copy with clear actionable steps and checklist format",
      "imagePrompt": "Prompt for AI image generator"
    }
  ]
}`;

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawText = textResponse.text || "";
        let resultData: any = null;

        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                resultData = JSON.parse(jsonMatch[0]);
            }
        } catch (jsonErr) {
            console.error("JSON parse error in competitor reverse engineer:", jsonErr);
        }

        if (!resultData) {
            resultData = {
                analysis: {
                    viralityScore: "90/100",
                    hookBreakdown: "Uses strong contrarian statement to create cognitive curiosity.",
                    psychologicalTriggers: ["Curiosity Gap", "Social Proof", "Practical Utility"],
                    structureBlueprint: "Bold Hook -> Core Problem -> Action Steps -> CTA",
                },
                adaptedVariations: [
                    {
                        style: "High-Energy Hook",
                        headline: `The secret to ${userNiche}`,
                        content: `Most people get ${userNiche} completely backwards.\n\nHere are 3 truths you need to know today:\n\n1. Focus on quality\n2. Maintain consistency\n3. Automate repetitive tasks\n\nWhat is your take on this?\n\n#Growth #${userNiche.replace(/\s+/g, "")}`,
                        imagePrompt: `A futuristic 3D graphic illustrating ${userNiche}`,
                    },
                ],
            };
        }

        res.status(200).json({
            success: true,
            data: resultData,
        });
    } catch (error: any) {
        console.error("Competitor reverse-engineer error:", error);
        res.status(500).json({
            message: error.message || "Failed to reverse engineer competitor post.",
        });
    }
};
