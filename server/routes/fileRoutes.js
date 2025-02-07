import express from "express";
import  upload  from "../config/multer.js";
import { generateCourseFile, downloadCourseFile } from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.array("files", 10), generateCourseFile);
router.get("/download", isAuthenticated, downloadCourseFile);

export default router;
