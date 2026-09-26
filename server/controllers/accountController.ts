// Get All Accounts

import zernio from "../config/zernio.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Account } from "../models/Account.js";
import { Response } from "express";

// GET /api/accounts
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const accounts = await Account.find({ user: req.user?._id });
        res.json(accounts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

// Add Account
// POST api/accounts/add
export const addAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform, handle, avatarUrl } = req.body;
        const account = new Account({
            user: req.user?._id,
            platform,
            handle,
            avatarUrl,
        });
        res.status(201).json({ message: "Account added successfully", account });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

// Disconnect Account
// DELETE api/accounts/:id
export const disconnectAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user?._id });
        if (!account) {
            res.status(404).json({ message: "Account not found" });
            return;
        }
        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({ path: { accountId: account.zernioAccountId } })
            } catch (error: any) {
                res.status(500).json({ message: error?.response?.data?.message || error.message || "Failed to delete from Zernio" });
                return;
            }
        }
        await account.deleteOne();
        res.json({ message: "Account disconnected successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}