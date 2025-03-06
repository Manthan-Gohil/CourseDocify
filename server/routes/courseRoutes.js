import express from "express"
import path from "path"
import fs from "fs"
import PDFDocument from"pdfkit";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {File} from "../models/File.js"

const router = express.Router();

router.post("/generate", isAuthenticated, async (req, res) => {
  try {
    const { courseName, courseCode, session, batch } = req.body;
    const username = req.user.fullname; // Get logged-in user's name
    // console.log(req.user);
    // ✅ Generate timestamp in "YYYY-MM-DD_HH-MM-SS" format
    const now = new Date();
    const formattedTimestamp = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
    const fileName = `CourseSummary_${formattedTimestamp}.pdf`;
    const filePath = path.join("./uploads", fileName);

    // Create PDF Document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

// Add Logo (Keeps its original position)
doc.image("public/logo.png", 50, 30, { width: 100 });

// Center "Course Details" text on the same line as the logo
doc
  .fontSize(28)
  .fillColor("#1D3557") // Dark blue color
  .text("Course Details", { align: "center", baseline: "middle", underline: true })
  .moveDown(3);

// Move content to the center of the page
doc
  .fontSize(20)
  .fillColor("black")
  .text(`Course Name: ${courseName}`, { align: "center" })
  .moveDown(1) // Adds space between lines
  .text(`Course Code: ${courseCode}`, { align: "center" })
  .moveDown(1)
  .text(`Session: ${session}`, { align: "center" })
  .moveDown(1)
  .text(`Batch: ${batch}`, { align: "center" })
  .moveDown(3); // Extra space before footer

  // Footer
doc.fontSize(12).text(`Prepared by - ${username}`, { align: "right" });

doc.end();

    stream.on("finish", async () => {
      try {
        // 🔹 Save file info in MongoDB
        const newFile = new File({
          filename: fileName,
          fileType: path.extname(fileName),
          filePath: `/uploads/${fileName}`, // Relative path
          uploadedBy: req.user._id, // User ID
          createdAt: new Date(),
        });

        await newFile.save(); // Save to database

        res.status(200).json({
          success: true,
          message: "Course summary generated & saved!",
          courseFile: newFile,
        });
      } catch (dbError) {
        console.error("Database Error:", dbError);
        res.status(500).json({ success: false, message: "Error saving file to database." });
      }
    });
  
  } catch (error) {
    console.error("Error generating course summary:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
