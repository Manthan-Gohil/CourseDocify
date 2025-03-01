import { processFiles } from "../utils/fileProcessor.js";
import { generatePDF } from "../utils/pdfGenerator.js";
const UPLOADS_DIR = "./uploads"; 
import { File } from "../models/File.js";
import path from "path";
import fs from "fs";


let uploadedFilesList = []; // ✅ Store all uploaded files temporarily

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user?._id });
    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const userId = req.user?._id;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // ✅ Store uploaded files temporarily
    uploadedFilesList = [...uploadedFilesList, ...uploadedFiles];

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully!",
      uploadedFiles: uploadedFilesList,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ New function to generate a single merged course file
export const generateCourseFile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (uploadedFilesList.length === 0) {
      return res.status(400).json({ success: false, message: "No files to generate course file" });
    }

    // ✅ Generate timestamp in "YYYY-MM-DD_HH-MM-SS" format
    const now = new Date();
    const formattedTimestamp = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
    // ✅ Process all uploaded files
    const mergedContent = await processFiles(uploadedFilesList);

    // ✅ Generate a single course file (PDF)
    const courseFileName = `CourseFile_${formattedTimestamp}.pdf`;
    const courseFilePath = path.join(UPLOADS_DIR, courseFileName);
    await generatePDF(mergedContent, courseFilePath);

    // ✅ Save the generated course file in MongoDB
    const courseFile = await File.create({
      filename: courseFileName,
      fileType: ".pdf",
      filePath: courseFilePath,
      uploadedBy: userId,
    });

    // ✅ Clear uploaded files list after generating the course file
    uploadedFilesList = [];

    return res.status(200).json({
      success: true,
      message: "Course file generated successfully",
      courseFile,
    });
  } catch (error) {
    console.error("Error generating course file:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const filePath = path.join(process.cwd(), "uploads", file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File does not exist" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    return res.download(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(500).json({ success: false, message: "File download failed" });
  }
};
