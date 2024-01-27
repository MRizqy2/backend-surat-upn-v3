const express = require("express");
const cloudinary = require("../../../../config/cloudinaryConfig");
const { StatusCodes } = require("http-status-codes");
const { Daftar_surat } = require("../../../models");
const { PDFDocument } = require("pdf-lib");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "daftar_surat/thumbnail/"
      : "daftar_surat/";

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // Gunakan judul sebagai nama file
    const judul = req.body.judul || "default";
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}-${judul}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const putSuratUrl = async (req, res, next) => {
  try {
    const { outputPath, surat_id } = req.body;

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    const fileName = outputPath.split("\\").pop(); //karena directori windows
    const fileBuffer = fs.readFileSync(outputPath);
    const judulExt = surat.judul;
    const judulFinal = judulExt.replace(".pdf", "-acc.pdf");

    const downloadUrl = `${
      process.env.NGROK
    }/daftar-surat/multer/download/${encodeURIComponent(fileName)}`;

    const update_surat = await Daftar_surat.update(
      {
        judul: judulFinal,
        url: downloadUrl,
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
