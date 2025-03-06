import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import ExcelJS from "exceljs";
import path from "path";

// Function to process Excel files
const processExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook.worksheets[0].getSheetValues();
};

// Function to process PDF files
const processPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Function to process DOCX files
const processDOCX = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
};

// ✅ Extract file data & calculate page count
export const processFiles = async (files) => {
  let processedFiles = [];

  for (const file of files) {
    const filePath = file.path;
    const ext = path.extname(file.originalname).toLowerCase();
    let fileData = "";
    
    if (ext === ".xlsx" || ext === ".xls") {
      fileData = JSON.stringify(await processExcel(filePath), null, 2);
    } else if (ext === ".pdf") {
      fileData = await processPDF(filePath);
    } else if (ext === ".docx") {
      fileData = await processDOCX(filePath);
    } else {
      fileData = fs.readFileSync(filePath, "utf-8");
    }

    processedFiles.push({ title: file.originalname, content: fileData, pageCount: Math.ceil(fileData.length / 2000) });
  }

  return processedFiles;
};