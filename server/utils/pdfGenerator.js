import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generatePDF = async (req, courseInfo, uploadedFilePaths, outputPath) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ✅ Page 1: Course Details
    const coursePage = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = coursePage.getSize();

    coursePage.drawText("BML Munjal University", { x: width / 2 - 100, y: height - 50, size: 24, font, color: rgb(0.1, 0.1, 0.5) });
    coursePage.drawText("Course Details", { x: width / 2 - 60, y: height - 100, size: 20, font, underline: true });

    coursePage.drawText(`Course Name: ${courseInfo.courseName}`, { x: 50, y: height - 150, size: 14, font });
    coursePage.drawText(`Course Code: ${courseInfo.courseCode}`, { x: 50, y: height - 180, size: 14, font });
    coursePage.drawText(`Session: ${courseInfo.session}`, { x: 50, y: height - 210, size: 14, font });
    coursePage.drawText(`Batch: ${courseInfo.batch}`, { x: 50, y: height - 240, size: 14, font });
    coursePage.drawText(`Prepared by: ${req.user.fullname}`, { x: 50, y: height - 270, size: 14, font });

    // ✅ Page 2: Table of Contents
    const tocPage = pdfDoc.addPage([595, 842]);
    tocPage.drawText("Table of Contents", { x: width / 2 - 70, y: height - 50, size: 22, font, underline: true });

    let tocY = height - 100;
    let currentPageNumber = 3; // Since first page is course details

    for (const file of uploadedFilePaths) {
      const { originalName, path: filePath } = file;
      
      if (fs.existsSync(filePath)) {
        const fileBytes = fs.readFileSync(filePath);
        const uploadedPdf = await PDFDocument.load(fileBytes);
        const copiedPages = await pdfDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());

        tocPage.drawText(`${originalName} - Page ${currentPageNumber}`, { x: 50, y: tocY, size: 12, font });
        tocY -= 20; // Move down for next entry
        currentPageNumber += copiedPages.length; // Update page number

        copiedPages.forEach((page) => {
          pdfDoc.addPage(page);
        });

      } else {
        console.warn(`⚠️ File not found: ${filePath}`);
      }
    }
    
      // ✅ Add Page Numbers
      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        page.drawText(`Page ${i + 1} of ${totalPages}`, {
          x: width / 2 - 30,
          y: 20,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }
      
    // ✅ Save the final merged PDF
    const finalPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, finalPdfBytes);

    console.log("✅ Course file generated successfully!");

  } catch (error) {
    console.error("❌ Error generating course file:", error);
  }
};