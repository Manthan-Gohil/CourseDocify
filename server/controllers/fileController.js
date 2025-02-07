import fs from "fs";
import path from "path";
import { processFiles } from "../utils/fileProcessor.js";
import { generatePDF } from "../utils/pdfGenerator.js";
import { File } from "../models/File.js"; // Ensure you import File model

const UPLOADS_DIR = "./uploads";

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Function to generate course file
export const generateCourseFile = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const userId = req.user?._id; // Ensure user is authenticated

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Save uploaded files metadata in MongoDB
    const savedFiles = await Promise.all(
      uploadedFiles.map((file) =>
        File.create({
          filename: file.originalname,
          fileType: path.extname(file.originalname),
          filePath: file.path,
          uploadedBy: userId,
        })
      )
    );

    // Process files and merge content
    const mergedContent = await processFiles(uploadedFiles);

    // Generate final course file
    const courseFileName = `CourseFile-${Date.now()}.pdf`;
    const courseFilePath = path.join(UPLOADS_DIR, courseFileName);
    await generatePDF(mergedContent, courseFilePath);

    // Save generated course file metadata in MongoDB
    const courseFile = await File.create({
      filename: courseFileName,
      fileType: ".pdf",
      filePath: courseFilePath,
      uploadedBy: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Course file generated successfully",
      courseFile,
      uploadedFiles: savedFiles,
    });
  } catch (error) {
    console.error("Error generating course file:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to download course file
export const downloadCourseFile = (req, res) => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ success: false, message: "File path is required" });
    }

    const absolutePath = path.resolve(filePath);
    res.download(absolutePath);
  } catch (error) {
    console.error("Error downloading course file:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
