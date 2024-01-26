const multer = require("multer");
const express = require("express");
const path = require("path");
const { Template_surat, Jenis_surat } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

// Pastikan express.json() dan express.urlencoded() ditempatkan sebelum multer
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "template_surat/thumbnail/"
      : "template_surat/";

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // Gunakan judul sebagai nama file
    const judul = req.body.judul || "default";
    // console.log("Judul:", req);
    const filename = `${judul}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// Route untuk endpoint /multer
const postMulter = async function (req, res) {
  try {
    let lokasiThumbnail;
    const { judul, deskripsi, jenis_id } = req.body;
    const suratFile = req.files["surat"][0];
    const thumbnailFile = req.files["thumbnail"]
      ? req.files["thumbnail"][0]
      : null;

    const jenis = await Jenis_surat.findOne({
      where: { id: jenis_id },
    });

    const judulEx = judul + path.extname(suratFile.originalname);

    const suratUrl = judulEx;
    const downloadUrl = `${
      process.env.NGROK
    }/template-surat/multer/downloadv2/${encodeURIComponent(suratUrl)}`;

    if (thumbnailFile) {
      lokasiThumbnail = path.join(
        __dirname,
        "../../../../template_surat/thumbnail",
        thumbnailFile.filename
      );
    }

    const downloadThumbnail = lokasiThumbnail
      ? `${process.env.NGROK}/download/${encodeURIComponent(lokasiThumbnail)}`
      : null;

    const template_surat = await Template_surat.create({
      judul: judulEx,
      url: downloadUrl,
      jenis_id: jenis.id || "",
      thumnail: downloadThumbnail || "",
      deskripsi: deskripsi || "",
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", template_surat });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  postMulter
);

module.exports = router;
