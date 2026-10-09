import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import zernio from "../config/zernio.js";
import { User } from "../models/User.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
import { publishPostToZernio } from "../services/schedulerService.js";

// Helper to poll Leonardo.ai
const pollLeonardoJob = async (generationId: string, apikey: string) : Promise<string> => {
    const maxRetries = 20;
    const delay = 5000;

    for(let i = 0; i< maxRetries; i++) {
        try {
            const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {headers: {accept: "application/json", authorization: `Bearer ${apikey}`}});

            const generation = response.data.generations_by_pk;
            if(generation.status === "COMPLETE") {
                if(generation.generated_images && generation.generated_images.length > 0) {
                    return generation.generated_images[0].url;
                }
                throw new Error("Generation complete but no image found.")
            }
            if(generation.status === "FAILED") {
                throw new Error("Leonardo.ai generation failed.")
            } 
        } catch (error: any) {
            console.error("Polling Error:", error?.response?.data || error.message)
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
    }
    throw new Error("Leonardo.ai generation timed out.")
}

import { checkAndDeductAiCredits } from "./authController.js";

// Generate post
// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { prompt, tone, generateImage } = req.body;

        const apikey = req.user?.geminiApiKey || process.env.GEMINI_API_KEY;

        if (!apikey) {
            res.status(400).json({
                isMissingKey: true,
                message: "Gemini API key is missing. Please configure it in Settings -> API Keys or add it to server/.env file."
            });
            return;
        }

        // Check and deduct credit
        const creditCheck = await checkAndDeductAiCredits(req.user._id, generateImage ? 2 : 1);
        if (!creditCheck.allowed) {
            res.status(403).json({
                isQuotaExhausted: true,
                creditsRemaining: creditCheck.remaining,
                message: "⚠️ AI Generation Credits Exhausted (0 remaining). Please enter your free Google Gemini API Key in Settings -> API Keys for Unlimited Generations!"
            });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apikey });
        let textResponse;
        try {
            textResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a social media post based on this prompt: "${prompt}". Tone: ${tone}. Include relevant hashtags. Format the response as JSON with "content" and "imagePrompt" fields. The "imagePrompt" should be a highly descriptive prompt for a image generator that complements the post.`,
            });
        } catch (aiErr: any) {
            if (aiErr?.status === 429 || aiErr?.message?.includes("RESOURCE_EXHAUSTED") || aiErr?.message?.includes("quota") || aiErr?.message?.includes("429")) {
                res.status(429).json({
                    isQuotaExhausted: true,
                    message: "⚡ Google Gemini AI Token Quota Exhausted. Please enter your personal Gemini API key in Settings -> API Keys for uninterrupted access."
                });
                return;
            }
            throw aiErr;
        }

        let content = "";
        let imagePrompt = prompt;

        try {
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
            content = data.content;
            imagePrompt = data.imagePrompt;
        } catch (error) {
            content = textResponse.text || "";
        }

        let mediaUrl = "";
        if (generateImage) {
            try {
                const leonardokey = req.user?.leonardoApiKey || process.env.LEONARDO_API_KEY;
                if (!leonardokey) {
                    throw new Error("Leonardo API key is missing. Please configure it in Settings -> API Keys or add it to server/.env file.");
                }
                if (leonardokey) {
                    // Use Leonardo.ai for image generation
                    const leoResponse = await axios.post(
                        "https://cloud.leonardo.ai/api/rest/v2/generations",
                        {
                            "public": false,
                            "model": "gpt-image-2",
                            "parameters": {
                                "quality": "LOW",
                                "prompt": imagePrompt,
                                "quantity": 1,
                                "width": 1024,
                                "height": 1024,
                                "prompt_enhance": "OFF",
                            }
                        },
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Bearer ${leonardokey}`,
                                "content-type": "application/json"
                            }
                        }
                    )
                    const generationId = leoResponse.data.generate.generationId;
                    const tempUrl = await pollLeonardoJob(generationId, leonardokey);

                    // Upload to Cloudnariy for persistence
                    const uploadResult = await cloudinary.uploader.upload(tempUrl, {
                        folder: "ai-generations",
                    });
                    mediaUrl = uploadResult.secure_url;
                }
            } catch (err: any) {
                console.error("Image generation failed:", err.message);
            }
        }
        
        // Save generation to DB
        const generation = await Generation.create({
            user: req.user?.id,
            prompt,
            content,
            mediaUrl: mediaUrl,
            mediaType: mediaUrl ? "image" : undefined,
            tone: tone
        });

        // Response to client
        res.status(201).json({
            message: "Post generated successfully",
            generation,
            creditsRemaining: creditCheck.remaining,
            isUnlimited: creditCheck.isUnlimited
        });

    } catch (error: any) {
        console.error(error);
        if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota")) {
            res.status(429).json({
                isQuotaExhausted: true,
                message: "⚡ AI Token Quota Exhausted on current API Key. Please add your own personal API Key in Settings -> API Keys."
            });
            return;
        }
        res.status(500).json({ message: error.message || "Failed to generate post" });
    }
}

// Get generations
// GET /api/posts/generations
export const getGenerations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const generations = await Generation.find({user: req.user._id}).sort({createdAt: -1});
        res.status(200).json(generations);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to get post generations" });
    }
}

// Get posts
// GET /api/posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({user: req.user._id}).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to get posts" });
    }
}

// Schedule posts
// POST /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;

        // Parse platforms if it comes as a stringified array form FormData
        let parsedPlatforms = platforms;
        if(typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch (err) {
                parsedPlatforms = platforms.split(",");
            }
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" | undefined = req.body.mediaType;

        if(req.file) {
            const result = await new Promise<any>((resolve, reject)=> {
                const stream = cloudinary.uploader.upload_stream({resource_type: "auto", folder: "social-scheduler"}, (error, result) => {
                    if(error) reject(error);
                    else resolve(result)
                });
                stream.end(req.file!.buffer);
            })

            mediaUrl = result.secure_url;
            mediaType = result.resource_type === "video" ? "video" : "image";
        }

        // Create post
        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status: status || "scheduled",
        });

        res.status(201).json({message: "Post scheduled successfully", post});
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to schedule post" });
    }
}

// Delete generation
// DELETE /api/posts/generations/:id
export const deleteGeneration = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const generation = await Generation.findById(req.params.id);
        if (!generation) {
            res.status(404).json({ message: "Generation not found" });
            return;
        }

        if (generation.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        await generation.deleteOne();
        res.status(200).json({ message: "Generation deleted successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete generation" });
    }
}

// Delete scheduled or failed post
// DELETE /api/posts/:id
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post" });
    }
}

// Update post
// PUT /api/posts/:id
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const { content, platforms, scheduledFor, removeMedia } = req.body;

        if (content) post.content = content;
        if (scheduledFor) post.scheduledFor = new Date(scheduledFor);

        if (platforms) {
            let parsedPlatforms = platforms;
            if (typeof platforms === "string") {
                try {
                    parsedPlatforms = JSON.parse(platforms);
                } catch (err) {
                    parsedPlatforms = platforms.split(",");
                }
            }
            post.platforms = parsedPlatforms;
        }

        if (removeMedia === "true" || removeMedia === true) {
            post.mediaUrl = undefined;
            post.mediaType = undefined;
        }

        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "social-scheduler" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file!.buffer);
            });

            post.mediaUrl = result.secure_url;
            post.mediaType = result.resource_type === "video" ? "video" : "image";
        }

        // Reset status to scheduled if user updates a failed post
        if (post.status === "failed") {
            post.status = "scheduled";
            post.errorMessage = undefined;
        }

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to update post" });
    }
}

// Publish post immediately (Publish Now / Retry)
// POST /api/posts/:id/publish-now
export const publishPostNow = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        try {
            await publishPostToZernio(post);
            res.status(200).json({ message: "Post published successfully", post });
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to publish post";
            post.status = "failed";
            post.errorMessage = errorMsg;
            await post.save();
            res.status(500).json({ message: errorMsg, post });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Failed to publish post" });
    }
}