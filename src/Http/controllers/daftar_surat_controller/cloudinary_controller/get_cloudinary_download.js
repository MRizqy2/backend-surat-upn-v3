const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const {
  Daftar_surat,
  Template_surat,
  Role_user,
  Users,
  Jenis_surat,
} = require("../../../../models");
// const getStatus = require("./status_controller");
// const { postStatus } = require("../../status_surat_controller/post_status");
// const {
//   postTampilan,
// } = require("../../tampilan_surat_controller/tampilan_surat_controller");
// const status = getStatus();

const fs = require("fs");
const fetch = require("node-fetch");

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
  const { surat_id } = req.query;
  if (!surat_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid params" });
  }

  const daftar_surat = await Daftar_surat.findOne({
    where: { id: surat_id },
  });

  if (!daftar_surat) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Daftar Surat not found" });
  }

  // const fileName = "newFileName.pdf"; // Ganti dengan nama file yang diinginkan/
  const fileName = daftar_surat.judul;
  const downloadUrl = `${daftar_surat.url}?attachment=${encodeURIComponent(
    fileName
  )}`;

  // Download file dari Cloudinary
  const response = await fetch(downloadUrl);
  const fileBuffer = await response.buffer();

  const tempDir = "/tmp/daftar_surat";
  // Periksa apakah direktori sudah ada
  if (!fs.existsSync(tempDir)) {
    // Jika tidak, buat direktori
    fs.mkdirSync(tempDir);
  }

  // Simpan file di server Anda//
  const filePath = "/tmp/daftar_surat/temp";
  fs.writeFileSync(filePath, fileBuffer);

  // Kembalikan file kepada klien dengan nama yang diinginkan
  res.download(filePath, fileName);
};

router.get("/download/cloudinary", getDownload);

module.exports = {
  router,
  getDownload,
};
