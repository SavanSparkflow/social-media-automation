import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import { checkAndDeductAiCredits } from "./authController.js";
import axios from "axios";

// Helper to scrape text from a web page
async function scrapeUrl(targetUrl: string): Promise<{ title: string; content: string }> {
    try {
        // YouTube URL handling
        if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
            try {
                const oembedRes = await axios.get(
                    `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`,
                    { timeout: 8000 }
                );
                const title = oembedRes.data?.title || "YouTube Video";
                const author = oembedRes.data?.author_name || "";
                return {
                    title,
                    content: `YouTube Video Title: ${title}\nChannel: ${author}\nVideo Link: ${targetUrl}`,
                };
            } catch (ytErr) {
                return { title: "YouTube Video", content: `YouTube Video: ${targetUrl}` };
            }
        }

        // Standard web page scraping
        const response = await axios.get(targetUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            timeout: 10000,
            maxContentLength: 5 * 1024 * 1024,
        });

        const html = String(response.data);

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "Article";

        // Clean HTML to extract readable text
        let cleanText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
            .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
            .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
            .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        // Limit length to avoid blowing up context token limits
        if (cleanText.length > 8000) {
            cleanText = cleanText.substring(0, 8000);
        }

        return { title, content: cleanText };
    } catch (err: any) {
        throw new Error(`Failed to extract content from URL: ${err.message}`);
    }
}

// Repurpose Content Endpoint
// POST /api/posts/repurpose
export const repurposeContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { inputType, sourceText, sourceUrl, tone = "Engaging" } = req.body;

        let contentToProcess = "";
        let contentTitle = "";

        if (inputType === "url" || (sourceUrl && sourceUrl.trim().startsWith("http"))) {
            const url = (sourceUrl || sourceText).trim();
            const scraped = await scrapeUrl(url);
            contentTitle = scraped.title;
            contentToProcess = scraped.content;
        } else {
            contentToProcess = (sourceText || "").trim();
            contentTitle = "Custom Text / Notes";
        }

        if (!contentToProcess || contentToProcess.length < 15) {
            res.status(400).json({
                message: "Please provide valid source text or a working article/video URL (at least 15 characters).",
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

        const prompt = `You are an elite Social Media Strategist and Ghostwriter.
Transform and repurpose the following source content into 4 distinct, highly engaging social media formats.

Source Title: "${contentTitle}"
Tone: ${tone}

Source Content:
"""
${contentToProcess}
"""

Please output ONLY a valid JSON object matching this exact structure:
{
  "title": "Brief catchy title for this repurposed package",
  "summary": "2-sentence executive summary of the content",
  "keyTakeaways": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ],
  "twitterThread": [
    "1/5 🧵 [Hook Tweet: Attention grabbing opener with emojis]",
    "2/5 💡 [Insight 1: Crisp value delivery]",
    "3/5 📊 [Insight 2: Actionable tactic or takeaway]",
    "4/5 ⚡ [Insight 3: Counter-intuitive perspective]",
    "5/5 🎯 [Outro Tweet: Summary + Call to Action to RT or comment]"
  ],
  "linkedinPost": "High converting LinkedIn post with strong first line hook, clear spacing between paragraphs, bulleted takeaways, emojis, and an interactive engagement question at the end. Include 3-5 hashtags.",
  "instagram": {
    "caption": "Catchy Instagram caption with emojis, readable formatting, CTA to save/share, and 5-8 relevant hashtags.",
    "imagePrompt": "A highly descriptive, photorealistic prompt for an AI image generator (Leonardo.ai / Midjourney) to generate a stunning visual that perfectly illustrates this topic."
  },
  "facebookPost": "Conversational, community-friendly Facebook discussion post that explains the main idea simply and encourages group members to share their experience in the comments."
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
            console.error("JSON parse error:", jsonErr);
        }

        if (!resultData) {
            // Fallback object if parsing fails
            resultData = {
                title: contentTitle,
                summary: "Repurposed content summary",
                keyTakeaways: ["Extracted insight from source content"],
                twitterThread: [
                    `1/3 🚀 Repurposing insights from: ${contentTitle}`,
                    `2/3 💡 Key insight: ${contentToProcess.slice(0, 150)}...`,
                    `3/3 🎯 Follow for more insights on this topic!`,
                ],
                linkedinPost: `🚀 Key lessons from ${contentTitle}:\n\n${contentToProcess.slice(0, 300)}...\n\n#Automation #ContentCreation`,
                instagram: {
                    caption: `Transforming ideas into impact ✨\n\n${contentToProcess.slice(0, 200)}...\n\n#ContentStrategy #Growth`,
                    imagePrompt: `A vibrant, modern 3D illustration of ${contentTitle}, glowing digital atmosphere, 8k resolution`,
                },
                facebookPost: `Hey everyone! Just came across this topic: ${contentTitle}. Here are the main highlights: ${contentToProcess.slice(0, 250)}... What are your thoughts on this?`,
            };
        }

        res.status(200).json({
            success: true,
            sourceTitle: contentTitle,
            data: resultData,
        });
    } catch (error: any) {
        console.error("Repurpose content error:", error);
        res.status(500).json({
            message: error.message || "Failed to repurpose content.",
        });
    }
};
