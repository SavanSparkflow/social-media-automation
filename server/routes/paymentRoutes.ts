import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder, verifyPayment, getSubscriptionStatus } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", protect, createOrder);
paymentRouter.post("/verify-payment", protect, verifyPayment);
paymentRouter.get("/status", protect, getSubscriptionStatus);

export default paymentRouter;
