import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { generatePost, getGenerations, getPosts, schedulePost } from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const PostRouter = express.Router();

PostRouter.get("/", protect, getPosts);
PostRouter.get("/generations", protect, getGenerations);
PostRouter.post("/", protect, upload.single("media"), schedulePost);
PostRouter.post("/generate", protect, generatePost);

export default PostRouter;