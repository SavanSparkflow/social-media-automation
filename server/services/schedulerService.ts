import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";

export const publishPostToZernio = async (post: any) => {
    const accounts = await Account.find({
        user: post.user,
        platform: { $in: post.platforms },
        status: "connected",
        zernioAccountId: { $exists: true }
    });

    if (accounts.length === 0) {
        throw new Error(`No connected accounts found for platforms: ${post.platforms.join(", ")}`);
    }

    const zernioPlatforms = accounts.map((acc) => ({
        platform: acc.platform as any,
        accountId: acc.zernioAccountId!
    }));

    const payload = {
        content: post.content,
        publishNow: true,
        ...(post.mediaUrl ? { mediaItems: [{ type: post.mediaType || "image", url: post.mediaUrl }] } : {}),
        platforms: zernioPlatforms,
    };

    console.log(`Publishing post ${post._id} to zernio with media: ${post.mediaUrl || "none"}`);
    const response = await zernio.posts.createPost({
        body: payload
    });

    const publishedPost = (response.data as any)?.post || response.data;
    if (!publishedPost) {
        throw new Error("Failed to get post object from Zernio response");
    }

    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);

    post.status = "published";
    post.errorMessage = undefined;
    await post.save();

    await ActivityLog.create({
        user: post.user,
        actionType: "POST_PUBLISHED",
        description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
        relatedPost: post._id,
    });

    return post;
};

export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublish = await Post.find({ status: "scheduled", scheduledFor: { $lte: now } });

            for (const post of postsToPublish) {
                try {
                    await publishPostToZernio(post);
                } catch (err: any) {
                    const errorMsg = err?.response?.data?.message || err?.message || "Failed to publish post";
                    console.error(`Failed to publish post ${post._id} :`, errorMsg);
                    post.status = "failed";
                    post.errorMessage = errorMsg;
                    await post.save();
                }
            }
            if (postsToPublish.length === 0) {
                console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`);
            }
        } catch (error) {
            console.error(`Scheduler error:`, error);
        }
    });
    console.log("Scheduler service initialized.");
};
