import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import zernio from "../config/zernio.js";
import { User } from "../models/User.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";

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

// Generate post
// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { prompt, tone, generateImage } = req.body;

        const apikey = process.env.GEMINI_API_KEY;

        if (!apikey) {
            res.status(400).json({ message: "Gemini API key is missing. please add it to your server/.env file." })
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apikey });
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a social media post based on this prompt: "${prompt}". Tone: ${tone}. Include relevant hashtags. Format the response as JSON with "content" and "imagePrompt" fields. The "imagePrompt" should be a highly descriptive prompt for a image generator that complements the post.`,
        })

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
                const leonardokey = process.env.LEONARDO_API_KEY;
                if (!leonardokey) {
                    throw new Error("Leonardo API key is missing. Please add it to your server/.env file.");
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
            generation
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate post" });
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