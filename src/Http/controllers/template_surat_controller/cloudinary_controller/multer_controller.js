// Import module yang dibutuhkan
const multer = require("multer");
const express = require("express");
const path = require("path");
const { Template_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

// Inisialisasi express app
const app = express();

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
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route untuk endpoint /multer
app.post(
  "/multer",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }, // tak makan sek/ o7?/ drmananya njir,oala
  ]),
  async function (req, res, next) {
    try {
      const { deskripsi, jenis } = req.body;
      const suratFile = req.files["surat"][0];
      const thumbnailFile = req.files["thumbnail"][0];

      const judul = suratFile.originalname;
      const judulCheck = await Template_surat.findOne({ where: { judul } });

      if (judulCheck) {
        res.json("Judul/file sudah ada");
      }

      const lokasiSurat = path.join(
        __dirname,
        "../../../../template_surat",
        suratFile.filename
      );
      const lokasiThumbnail = path.join(
        __dirname,
        "../../../../template_surat/thumnail",
        thumbnailFile.filename
      );

      const template_surat = await Template_surat.create({
        judul, // iki ga sido jepek nama file kah
        lokasi: lokasiSurat,
        jenis: jenis,
        thumnail: lokasiThumbnail,
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
  }
);

module.exports = app;
