import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generatePDF = async (
  req,
  courseInfo,
  uploadedFilePaths,
  outputPath
) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ✅ Page 1: Course Details
    const coursePage = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = coursePage.getSize();

    // 📌 Embed the university logo
    const logoBytes = fs.readFileSync("public/logo.jpg"); // Update path if needed
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    const logoDims = logoImage.scale(0.4);

    // 🖼 Draw logo at the top center with some top margin
    const logoTopMargin = 30;
    coursePage.drawImage(logoImage, {
      x: (width - logoDims.width) / 2,
      y: height - logoDims.height - logoTopMargin,
      width: logoDims.width,
      height: logoDims.height,
    });

    // 🏫 University name (centered below logo)
    const universityText = "BML MUNJAL UNIVERSITY";
    const uniFontSize = 24;
    const uniTextWidth = fontBold.widthOfTextAtSize(
      universityText,
      uniFontSize
    );
    coursePage.drawText(universityText, {
      x: (width - uniTextWidth) / 2,
      y: height - logoDims.height - logoTopMargin - 40,
      size: uniFontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // 📘 "Course File" title (centered below university name)
    const courseTitle = "Course File";
    const titleFontSize = 28;
    const titleTextWidth = fontBold.widthOfTextAtSize(
      courseTitle,
      titleFontSize
    );
    coursePage.drawText(courseTitle, {
      x: (width - titleTextWidth) / 2,
      y: height - logoDims.height - logoTopMargin - 90,
      size: titleFontSize,
      font: fontBold,
      underline: true,
    });

    // 📄 Course Details (left-aligned)
    let yStart = height - logoDims.height - logoTopMargin - 150;
    const spacing = 30;

    coursePage.drawText(`Course Name: ${courseInfo.courseName}`, {
      x: 60,
      y: yStart,
      size: 14,
      font,
    });
    coursePage.drawText(`Course Code: ${courseInfo.courseCode}`, {
      x: 60,
      y: yStart - spacing,
      size: 14,
      font,
    });
    coursePage.drawText(`Session: ${courseInfo.session}`, {
      x: 60,
      y: yStart - 2 * spacing,
      size: 14,
      font,
    });
    coursePage.drawText(`Batch: ${courseInfo.batch}`, {
      x: 60,
      y: yStart - 3 * spacing,
      size: 14,
      font,
    });

    coursePage.drawText(`Prepared by: ${req.user.fullname}`, {
      x: 60,
      y: yStart - 4.5 * spacing,
      size: 14,
      font,
    });

    // 📍 Address at bottom (centered)
    const addressText =
      "67th MILESTONE, NH-8, SIDHRAWALI, GURUGRAM, HARYANA - 122413";
    const addressFontSize = 12;
    const addressTextWidth = font.widthOfTextAtSize(
      addressText,
      addressFontSize
    );

    coursePage.drawText(addressText, {
      x: (width - addressTextWidth) / 2,
      y: 50,
      size: addressFontSize,
      font,
    });

    // ✅ Page 2: Table of Contents
    const tocPage = pdfDoc.addPage([595, 842]);

    // 🔠 Title: Centered & Underlined
    const tocTitle = "Table of Contents";
    const tocTitleSize = 22;
    const tocTitleWidth = font.widthOfTextAtSize(tocTitle, tocTitleSize);

    tocPage.drawText(tocTitle, {
      x: (width - tocTitleWidth) / 2,
      y: height - 60,
      size: tocTitleSize,
      font,
      underline: true,
      color: rgb(0, 0, 0),
    });

    let tocY = height - 100;
    let currentPageNumber = 3;
    const entryFontSize = 12;
    const entrySpacing = 20;

    for (const file of uploadedFilePaths) {
      const { originalName, path: filePath } = file;

      if (fs.existsSync(filePath)) {
        const fileBytes = fs.readFileSync(filePath);
        const uploadedPdf = await PDFDocument.load(fileBytes);
        const copiedPages = await pdfDoc.copyPages(
          uploadedPdf,
          uploadedPdf.getPageIndices()
        );

        // 📌 Create dot leader line (e.g. File Name...............Page 5)
        const pageLabel = `Page ${currentPageNumber}`;
        const dotLineLength = 90; // Adjust spacing between filename and page number
        const maxTextWidth = width - 100; // total allowed space for filename + dots + page number

        const fileNameWidth = font.widthOfTextAtSize(
          originalName,
          entryFontSize
        );
        const pageNumWidth = font.widthOfTextAtSize(pageLabel, entryFontSize);
        const dots = ".".repeat(
          Math.max(
            3,
            Math.floor(
              (maxTextWidth - fileNameWidth - pageNumWidth) /
                font.widthOfTextAtSize(".", entryFontSize)
            )
          )
        );

        const entryText = `${originalName} ${dots} ${pageLabel}`;

        tocPage.drawText(entryText, {
          x: 50,
          y: tocY,
          size: entryFontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });

        tocY -= entrySpacing;
        currentPageNumber += copiedPages.length;

        copiedPages.forEach((page) => {
          pdfDoc.addPage(page);
        });
      } else {
        console.warn(`⚠️ File not found: ${filePath}`);
      }
    }

    // ✅ Add Page Numbers to all pages (footer)
    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const footerText = `Page ${i + 1} of ${totalPages}`;
      const footerFontSize = 12;
      const textWidth = font.widthOfTextAtSize(footerText, footerFontSize);

      page.drawText(footerText, {
        x: (width - textWidth) / 2,
        y: 20,
        size: footerFontSize,
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
