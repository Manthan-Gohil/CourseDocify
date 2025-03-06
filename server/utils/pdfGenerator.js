import PDFDocument from "pdfkit";
import fs from "fs";


export const generatePDF = (courseInfo, files, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // ✅ Page 1: Course Details
      doc.image("public/logo.png", (doc.page.width - 100) / 2, 30, { width: 100 });
      doc.moveDown(7);
      doc.fontSize(28).fillColor("#1D3557").text("BML Munjal University", { align: "center" }).moveDown(1);
      doc.fontSize(24).fillColor("#1D3557").text("Course Details", { align: "center", underline: true }).moveDown(2);
      doc.fontSize(20).fillColor("black").text(`Course Name: ${courseInfo.courseName}`, { align: "center" }).moveDown(1);
      doc.fontSize(20).fillColor("black").text(`Course Code: ${courseInfo.courseCode}`, { align: "center" }).moveDown(1);
      doc.fontSize(20).fillColor("black").text(`Session: ${courseInfo.session}`, { align: "center" }).moveDown(1);
      doc.fontSize(20).fillColor("black").text(`Batch: ${courseInfo.batch}`, { align: "center" }).moveDown(3);
      doc.addPage();

      // ✅ Page 2: Table of Contents
      doc.fontSize(28).text("Table of Contents", { align: "center",baseline: "middle", underline: true }).moveDown(3);
      files.forEach((file, index) => {
        doc.fontSize(12).text(`${index + 1}. ${file.title} - Page ${index + 3}`);
      });
      doc.addPage();

      // ✅ Content Pages
      files.forEach((file) => {
        doc.fontSize(15).fillColor("blue").text(file.title, { underline: true }).moveDown();
        doc.fontSize(12).fillColor("black").text(file.content);
        doc.addPage();
      });

      doc.end();
      writeStream.on("finish", resolve);
    } catch (error) {
      reject(error);
    }
  });
};