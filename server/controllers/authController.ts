import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRECT || "fallback_secret", {expiresIn: "30d"});
}

// Register User
// POST /api/auth/register

export const registerUser = async (req: Request, res: Response):Promise<void> => {
    try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(500).json({message:"User already exists"});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        if(user) {
            res.status(201).json({_id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString())});
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
    }
}

// Login User
// POST /api/auth/login

export const loginUser = async (req: Request, res: Response):Promise<void> => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({_id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString())});
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
    }
}

// Get User Profile
// GET /api/auth/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

// Update User Profile
// PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, avatarUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (name) user.name = name;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            message: "Profile updated successfully"
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

// Change Password
// PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Please provide current and new password" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "New password must be at least 6 characters long" });
            return;
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}
