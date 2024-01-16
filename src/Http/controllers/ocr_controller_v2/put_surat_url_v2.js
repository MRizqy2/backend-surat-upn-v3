const express = require("express");
const cloudinary = require("../../../../config/cloudinaryConfig");
const { StatusCodes } = require("http-status-codes");
const { Daftar_surat } = require("../../../models");
const { PDFDocument } = require("pdf-lib");
// const isAdmin = require("../../../../middleware/adminMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const router = express.Router();

function getResourceType(filename) {
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
}

const putSuratUrlV2 = async (req, res, next) => {
  try {
    const { outputPath, surat_id } = req.save;
    // const { id } = req.query;
    // const jenis = await Jenis_surat.findOne({
    //   where: { id: jenis_id },
    // });
    console.log("asdwawd", outputPath);
    const pdfBytes = fs.readFileSync(outputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    let suratUrl;
    let thumbnailUrl;

    const judul = outputPath.split("/");
    const judulFinal = judul[judul.length - 1];

    console.log("onicad ", judulFinal);

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    if (req.save) {
      //   judulEx = judul + path.extname(req.files["surat"][0].originalname);

      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: getResourceType(surat.judul),
              public_id: path.parse(surat.judul),
            },
            (error, result) => {
              if (error) reject(error);
              else {
                suratUrl = result.url;
                resolve(result);
              }
            }
          )
          .end(pdfDoc);
      });
    }
    const suratUrlHttps = suratUrl.replace(/^http:/, "https:");

    // Upload thumbnail to Cloudinary
    // if (req.save) {
    //   await new Promise((resolve, reject) => {
    //     cloudinary.uploader
    //       .upload_stream(
    //         {
    //           resource_type: getResourceType(
    //             req.files.thumbnail[0].originalname
    //           ),
    //           public_id: path.parse(req.files.thumbnail[0].originalname),
    //         },
    //         (error, result) => {
    //           if (error) reject(error);
    //           else {
    //             thumbnailUrl = result.url;
    //             resolve(result);
    //           }
    //         }
    //       )
    //       .end(req.files.thumbnail[0].buffer);
    //   });
    // }

    // data_template_surat = await Template_surat.findOne({
    //   where: { id },
    // });
    // if (!data_template_surat) {
    //   return res.status(404).json({ error: "Template surat not found" });
    // }

    const update_surat = await Daftar_surat.update(
      {
        judul: judulFinal,
        url: suratUrlHttps,
        // jenis_id: jenis.id || "",
        // deskripsi: deskripsi || "",
        thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: surat_id }, // Gantilah dengan kriteria yang sesuai
        returning: true, // Menambahkan opsi returning
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

router.put("/", putSuratUrlV2);

module.exports = { router, putSuratUrlV2 };
