// import fs from "fs";
// import path from "path";
import { processFiles } from "../utils/fileProcessor.js";
import { generatePDF } from "../utils/pdfGenerator.js";
// import { File } from "../models/File.js"; // Ensure you import File model
// import mongoose from 'mongoose'

const UPLOADS_DIR = "./uploads";

// // Ensure uploads folder exists
// if (!fs.existsSync(UPLOADS_DIR)) {
//   fs.mkdirSync(UPLOADS_DIR, { recursive: true });
// }

// // Function to generate course file
// export const generateCourseFile = async (req, res) => {
//   try {
//     const uploadedFiles = req.files;
//     const userId = req.user?._id; // Ensure user is authenticated

//     if (!uploadedFiles || uploadedFiles.length === 0) {
//       return res.status(400).json({ success: false, message: "No files uploaded" });
//     }

//     // Save uploaded files metadata in MongoDB
//     const savedFiles = await Promise.all(
//       uploadedFiles.map((file) =>
//         File.create({
//           filename: file.originalname,
//           fileType: path.extname(file.originalname),
//           filePath: file.path,
//           uploadedBy: userId,
//         })
//       )
//     );

//     // Process files and merge content
//     const mergedContent = await processFiles(uploadedFiles);

//     // Generate final course file
//     const courseFileName = `CourseFile-${Date.now()}.pdf`;
//     const courseFilePath = path.join(UPLOADS_DIR, courseFileName);
//     await generatePDF(mergedContent, courseFilePath);

//     // Save generated course file metadata in MongoDB
//     const courseFile = await File.create({
//       filename: courseFileName,
//       fileType: ".pdf",
//       filePath: courseFilePath,
//       uploadedBy: userId,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Course file generated successfully",
//       courseFile,
//       uploadedFiles: savedFiles,
//     });
//   } catch (error) {
//     console.error("Error generating course file:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getUploadedFiles = async (req, res) => {
//   try {
//     const files = await File.find({ uploadedBy: req.user?._id }); // Fetch only user files

//     // console.log("Fetched files from DB:", files); // ✅ Check if files are fetched

//     return res.status(200).json({ success: true, files });
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // Function to download course file

// export const downloadCourseFile = async (req, res) => {
//   try {
//     const { fileId } = req.query;

//     // ✅ Validate fileId as a MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(fileId)) {
//       return res.status(400).json({ success: false, message: "Invalid file ID" });
//     }

//     // ✅ Find file in the database
//     const file = await File.findById(fileId);
//     if (!file) {
//       return res.status(404).json({ success: false, message: "File not found" });
//     }

//     const absolutePath = path.resolve(file.filePath);

//     // ✅ Check if file exists
//     if (!fs.existsSync(absolutePath)) {
//       return res.status(404).json({ success: false, message: "File does not exist" });
//     }

//     // ✅ Set correct headers for file download
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

//     res.download(absolutePath, file.filename, (err) => {
//       if (err) {
//         console.error("Download error:", err);
//         res.status(500).json({ success: false, message: "Failed to download file" });
//       }
//     });
//   } catch (error) {
//     console.error("Error downloading course file:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

import { File } from "../models/File.js";
import path from "path";
import fs from "fs";

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user?._id }); // Fetch only user files

    // console.log("Fetched files from DB:", files); // ✅ Check if files are fetched

    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const userId = req.user?._id; // Ensure user authentication

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


export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find file in database
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const filePath = path.resolve(file.filePath);

    // Check if file exists in storage
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File does not exist on the server" });
    }

    // Set response headers and send file for download
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    return res.download(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.status(500).json({ success: false, message: "File download failed" });
  }
};