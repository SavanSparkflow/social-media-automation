import multer from "multer";

const stronge = multer.memoryStorage();
export const upload = multer({storage: stronge})