import {Router} from 'express';
import { registerUser, loginUser, getProfile, updateProfile, changePassword, getApiKeys, updateApiKeys } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/profile', protect, getProfile);
authRouter.put('/profile', protect, updateProfile);
authRouter.put('/change-password', protect, changePassword);
authRouter.get('/api-keys', protect, getApiKeys);
authRouter.put('/api-keys', protect, updateApiKeys);

export default authRouter;