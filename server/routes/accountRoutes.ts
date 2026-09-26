import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAccounts, addAccount, disconnectAccount } from "../controllers/accountController.js";

const AccountsRouter = Router();

AccountsRouter.get('/', protect, getAccounts);
AccountsRouter.post('/add', protect, addAccount);
AccountsRouter.delete('/:id', protect, disconnectAccount);

export default AccountsRouter;