import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import AccountsRouter from "./routes/accountRoutes.js";
import PostRouter from "./routes/postRoutes.js";
import ActivityRouter from "./routes/activityRoutes.js";
import leadMagnetRouter from "./routes/leadMagnetRoutes.js";
import { initScheduler } from "./services/schedulerService.js";

const app = express();

// Database connection
await connectDB();

// Middleware
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter)
app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", AccountsRouter);
app.use("/api/posts", PostRouter);
app.use("/api/activity", ActivityRouter);
app.use("/api/lead-magnets", leadMagnetRouter);

// Initialize Scheduler
initScheduler();

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message);
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});