import {Router} from 'express';
import { registerUser, loginUser, getProfile, updateProfile, changePassword, getApiKeys, updateApiKeys, getCreditsStatus, checkApiKeysStatus } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/profile', protect, getProfile);
authRouter.get('/credits', protect, getCreditsStatus);
authRouter.put('/profile', protect, updateProfile);
authRouter.put('/change-password', protect, changePassword);
authRouter.get('/api-keys', protect, getApiKeys);
authRouter.put('/api-keys', protect, updateApiKeys);
authRouter.post('/api-keys/check-status', protect, checkApiKeysStatus);

export default authRouter;