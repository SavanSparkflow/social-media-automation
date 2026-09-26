import express from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/authMiddleware.js";

const socialAuthRouter = express.Router();

socialAuthRouter.get("/connect/:platform",protect, generateAuthUrl);
socialAuthRouter.post("/sync",protect, syncAccounts);

export default socialAuthRouter;