import expres from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getActivity } from "../controllers/activityController.js";

const ActivityRouter = expres.Router();

ActivityRouter.get('/', protect, getActivity);

export default ActivityRouter;