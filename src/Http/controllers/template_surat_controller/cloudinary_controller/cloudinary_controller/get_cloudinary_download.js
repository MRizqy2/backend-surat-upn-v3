const cloudinary = require("../../../../../../config/cloudinaryConfig");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../../../models");
const isAdmin = require("../../../../middleware/adminMiddleware");
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

const getDownload = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid params" });
  }

  const template_surat = await Template_surat.findOne({ where: { id: id } });

  if (!template_surat) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Template Surat not found" });
  }

  // const fileName = "newFileName.pdf"; // Ganti dengan nama file yang diinginkan
  const fileName = template_surat.judul;
  const downloadUrl = `${template_surat.url}?attachment=${encodeURIComponent(
    fileName
  )}`;

  // Download file dari Cloudinary
  const response = await fetch(downloadUrl);
  const fileBuffer = await response.buffer();

  const tempDir = "/tmp/template_surat";
  // Periksa apakah direktori sudah ada
  // if (!fs.existsSync(tempDir)) {
  //   // Jika tidak, buat direktori
  //   fs.mkdirSync(tempDir);
  // }
  if (!fs.existsSync(tempDir)) {
    // Jika tidak, buat direktori
    fs.promises.mkdirSync(tempDir, { recursive: true });
  }

  // Simpan file di server Anda
  // require("../../../../template_surat")
  // const filePath = "../../../../template_surat";
  // const filePath = "/tmp/template_surat/temp";
  const filePath = path.join(tempDir, fileName);
  // fs.writeFileSync(filePath, fileBuffer);
  fs.writeFile(filePath, fileBuffer, (err) => {
    if (err) throw err;
    console.log("File has been saved!");
  });

  // Kembalikan file kepada klien dengan nama yang diinginkan
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.download(filePath, fileName);
};

router.get("/detail", getDownload);

module.exports = {
  getDownload,
  router,
};
