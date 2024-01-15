const express = require("express");
const cloudinary = require("../../../../config/cloudinaryConfig");
const { StatusCodes } = require("http-status-codes");
const { Daftar_surat } = require("../../../models");
const { PDFDocument } = require("pdf-lib");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const getResourceType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
    ".ico",
  ];
  const videoExtensions = [".mp4", ".avi", ".mov", ".flv", ".wmv", ".mkv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "raw";
  }
};

// const putSuratUrl = async (req, res, next) => {
//   try {
//     const { outputPath, surat_id } = req.save;

//     // const pdfBytes = await readFileSyncPromise(outputPath);
//     const pdfBytes = fs.readFileSync(outputPath);
//     // const pdfBytes = await fetch(await pdfDoc.save());
//     // const pdfDoc = await PDFDocument.load(pdfBytes);
//     // const fileBuffer = await pdfDoc.buffer();

//     console.log("nnoidic", pdfBytes);
//     let suratUrl;

//     const judul = outputPath.split("/");
//     const judulFinal = judul[judul.length - 1];
//     console.log("mveok", judulFinal);

//     const surat = await Daftar_surat.findOne({
//       where: { id: surat_id },
//     });

//     await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             resource_type: getResourceType(surat.judul),
//             public_id: path.parse(surat.judul),
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else {
//               suratUrl = result.url;
//               resolve(result);
//             }
//           }
//         )
//         .end(pdfBytes);
//     });

//     suratUrl = result.url.replace(/^http:/, "https:");

//     const update_surat = await Daftar_surat.update(
//       {
//         judul: judulFinal,
//         url: suratUrl,
//       },
//       {
//         where: { id: surat_id },
//         returning: true,
//       }
//     );

//     return update_surat;
//   } catch (error) {
//     console.error("Error:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Internal Server Error" });
//   }
// };

const putSuratUrl = async (req, res, next) => {
  try {
    const { outputPath, surat_id } = req.save;

    let suratUrl;
    // const judulFinal = path.basename(outputPath, path.extname(outputPath));
    const surat = await Daftar_surat.findOne({
      // coba run ciy p//inpo run
      where: { id: surat_id }, // inpu run maneh bang
    });
    const judulFinal = surat.judul + path.extname(surat.judul);

    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: getResourceType(surat.judul),
          public_id: path.parse(surat.judul),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            suratUrl = result.url;
            suratUrl = suratUrl.replace(/^http:/, "https:");
            resolve(result);
          }
        }
      );

      const fileStream = fs.createReadStream(surat.judul);
      fileStream.pipe(stream);
    });

    const update_surat = await Daftar_surat.update(
      {
        judul: judulFinal,
        url: suratUrl,
      },
      {
        where: { id: surat_id },
        returning: true,
      }
    );

    return update_surat;
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putSuratUrl);

module.exports = { router, putSuratUrl };
