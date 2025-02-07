import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePDF = (content, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(12).text(content, { align: "left" });

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", (error) => reject(error));
  });
};
