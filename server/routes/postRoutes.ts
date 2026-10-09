import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { generatePost, getGenerations, getPosts, schedulePost, deleteGeneration, deletePost, updatePost, publishPostNow } from "../controllers/postController.js";
import { repurposeContent } from "../controllers/repurposeController.js";
import { generate30DayCampaign, batchScheduleCampaign } from "../controllers/campaignController.js";
import { reverseEngineerCompetitorPost } from "../controllers/competitorController.js";
import { upload } from "../config/multer.js";

const PostRouter = express.Router();

PostRouter.get("/", protect, getPosts);
PostRouter.get("/generations", protect, getGenerations);
PostRouter.post("/", protect, upload.single("media"), schedulePost);
PostRouter.post("/generate", protect, generatePost);
PostRouter.post("/repurpose", protect, repurposeContent);

// 30-Day Campaign Autopilot
PostRouter.post("/campaign/generate-30-days", protect, generate30DayCampaign);
PostRouter.post("/campaign/batch-schedule", protect, batchScheduleCampaign);

// Competitor Reverse-Engineer
PostRouter.post("/competitor/reverse-engineer", protect, reverseEngineerCompetitorPost);

PostRouter.delete("/generations/:id", protect, deleteGeneration);
PostRouter.put("/:id", protect, upload.single("media"), updatePost);
PostRouter.delete("/:id", protect, deletePost);
PostRouter.post("/:id/publish-now", protect, publishPostNow);
PostRouter.post("/:id/retry", protect, publishPostNow);

export default PostRouter;