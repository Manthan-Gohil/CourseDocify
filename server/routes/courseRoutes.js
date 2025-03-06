import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { saveCourseInfo } from "../controllers/fileController.js";

const router = express.Router();

// ✅ Store course details in session/database before file upload
router.post("/save", isAuthenticated, saveCourseInfo);

export default router;
