import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePDF = (content, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      // ✅ Use a built-in font (avoid missing font issue)
      doc.font("Times-Roman");

      // ✅ Ensure correct text format
      doc.text(content, { align: "left" });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.end();

      writeStream.on("finish", () => {
        console.log("PDF Generated Successfully:", filePath);
        resolve();
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};
