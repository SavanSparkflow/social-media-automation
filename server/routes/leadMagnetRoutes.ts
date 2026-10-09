import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    aiDraftLeadMagnet,
    getLeadMagnets,
    createLeadMagnet,
    updateLeadMagnet,
    deleteLeadMagnet,
    testTriggerLeadMagnet,
} from "../controllers/leadMagnetController.js";

const leadMagnetRouter = express.Router();

leadMagnetRouter.get("/", protect, getLeadMagnets);
leadMagnetRouter.post("/", protect, createLeadMagnet);
leadMagnetRouter.post("/ai-draft", protect, aiDraftLeadMagnet);
leadMagnetRouter.put("/:id", protect, updateLeadMagnet);
leadMagnetRouter.delete("/:id", protect, deleteLeadMagnet);
leadMagnetRouter.post("/:id/test-trigger", protect, testTriggerLeadMagnet);

export default leadMagnetRouter;
