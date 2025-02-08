import express from "express";
import  upload  from "../config/multer.js";
import { generateCourseFile, downloadCourseFile } from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getUploadedFiles } from "../controllers/fileController.js"; 

const router = express.Router();

router.post("/upload", isAuthenticated, upload.array("files"), generateCourseFile);
router.get("/download", isAuthenticated, downloadCourseFile);
router.get("/",isAuthenticated, getUploadedFiles);
export default router;
