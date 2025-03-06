import express from "express";
import upload from "../config/multer.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getFiles, uploadFiles, generateCourseFile, downloadFile } from "../controllers/fileController.js";

const router = express.Router();

// ✅ Fetch uploaded files
router.get("/", isAuthenticated, getFiles);

// ✅ Upload multiple files
router.post("/upload", isAuthenticated, upload.array("files", 10), uploadFiles);

// ✅ Generate a single merged course file (new updated function)
router.post("/generate-course-file", isAuthenticated, generateCourseFile);

// ✅ Download the generated course file
router.get("/download/:fileId", isAuthenticated, downloadFile);

export default router;
