const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");

const changeTextInPdfV2 = async (
  inputPath,
  outputPath,
  searchText,
  newText
) => {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Extract text content from the page
    const textContent = await firstPage.getTextContent();

    // Convert text content to a single string for searching
    const pageText = textContent.items.map((item) => item.str).join("");

    // Find the index of searchText in the text content
    const textIndex = pageText.indexOf(searchText);

    if (textIndex !== -1) {
      // Temukan posisi awal dan akhir kata
      const startPosition = textIndex;
      const endPosition = textIndex + searchText.length - 1;

      // Update the position as needed
      const x = 220;
      const y = 685;

      const fontSize = 11;
      const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
      const textWidth = newText.length * fontSize * 0.6;
      const textHeight = fontSize;

      firstPage.drawRectangle({
        x: x,
        y: y,
        width: textWidth,
        height: textHeight,
        color: rgb(1, 1, 1),
      });

      firstPage.drawText(newText, {
        x: x,
        y: y,
        size: fontSize,
        color: rgb(0, 0, 0),
        font: font,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, modifiedPdfBytes);

      console.log("Perubahan teks pada PDF berhasil disimpan ke", outputPath);
    } else {
      return { error: "Kata tidak ditemukan." };
    }
  } catch (error) {
    console.error("Error during PDF parsing:", error);
    return { error: "Terjadi kesalahan selama parsing PDF." };
  }
};

module.exports = {
  changeTextInPdfV2,
};

// // fusion of post word and get koor
// const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const changeTextInPdfV2 = async (
//   inputPath,
//   outputPath,
//   searchText,
//   newText
// ) => {
//   try {
//     // const dataBuffer = fs.readFileSync(inputPath);
//     // const data = await pdfParse(dataBuffer);
//     // console.log("l;mvepm");
//     // const textIndex = data.text.indexOf(searchText);

//     if (textIndex !== -1) {
//       // scanne iku mek kayak nyimpen array/ dadi asline gk nyimpen koordinate
//       // Temukan posisi awal dan akhir kata
//       const startPosition = textIndex; // lek teks e ga atek dikali, teks e muncul gak?/hah
//       const endPosition = textIndex + searchText.length - 1;

//       startPosition, endPosition;

//       const pdfBytes = fs.readFileSync(inputPath);
//       const pdfDoc = await PDFDocument.load(pdfBytes);
//       console.log("mkpmqwmdd", pdfDoc);
//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       // const x = startPosition;
//       // const y = endPosition;

//       // console.log("x : ", x);
//       // console.log("y : ", y);

//       // const pointToCm = (pointValue) => pointValue * (2.54 / 72);
//       const fontSize = 11;
//       const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
//       const textWidth = newText.length * fontSize * 0.6; // Adjust as needed
//       const textHeight = fontSize; //
//       firstPage.drawRectangle({
//         // x: x, // Adjust multiplier as needed
//         // y: y, // Adjust multiplier as needed
//         x: 220,
//         y: 685,
//         width: textWidth,
//         height: textHeight,
//         color: rgb(1, 1, 1),
//       });

//       firstPage.drawText(newText, {
//         //
//         // x: x, //0 => 500
//         // y: y, //0 => 1000
//         //x :  2229.5 / kok gede banget angka scanne// Coba gk usah dikali yo
//         // y :  7807.5
//         x: 220,
//         y: 685,
//         size: fontSize,
//         color: rgb(0, 0, 0),
//         font: font,
//       });

//       // console.log(" x * 12.5", x * 6.5);
//       // console.log("y * 37.5 ", y * 20.83);

//       const modifiedPdfBytes = await pdfDoc.save();
//       console.log("modifiedPdfBytes ", modifiedPdfBytes);
//       fs.writeFileSync(outputPath, modifiedPdfBytes);
//     } else {
//       return { error: "Kata tidak ditemukan." };
//     }
//   } catch (error) {
//     console.error("Error during PDF parsing:", error);
//     return { error: "Terjadi kesalahan selama parsing PDF." };
//   }
// };

// module.exports = {
//   changeTextInPdfV2,
// };
