const express = require("express");
const app = express.Router();
const multer = require("multer");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { changeTextInPdfV2 } = require("./post_coordinate_controller");
const { putSuratUrl } = require("./put_surat_url");
const { NOMOR_SURAT, DAFTAR_SURAT } = require("../../../models");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "daftar_surat/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

const OCR = async (req, res) => {
  const { nomor_surat_id, surat_id } = req.save;

  const daftar_surat = await DAFTAR_SURAT.findOne({ where: { id: surat_id } });

  if (!daftar_surat) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Daftar Surat not found" });
  }

  const fileName = daftar_surat.judul;
  const downloadUrl = `${daftar_surat.url}?attachment=${encodeURIComponent(
    fileName
  )}`;

  // Download file dari Cloudinary
  const response = await fetch(downloadUrl);
  const fileBuffer = await response.buffer();

  // const tempDir = `../../../daftar_surat`;
  // // Periksa apakah direktori sudah ada
  // if (!fs.existsSync(tempDir)) {
  //   // Jika tidak, buat direktori
  //   fs.mkdirSync(tempDir);
  // }
  // const filePath = `${tempDir}/tempFile`;
  // fs.writeFileSync(filePath, fileBuffer);
  // const finalFilePath = `${tempDir}/${daftar_surat.judul}`;
  // fs.renameSync(filePath, finalFilePath);
  // // tak coba sg prototipe wingi isok gae file anyar kok
  // const inputPath = `${finalFilePath}`; //iki error input path e ga sih// coba lek ngene
  // const outputPath = `${tempDir}/acc/${daftar_surat.judul.replace(
  //   ".pdf",
  //   "-acc.pdf"
  // )}`;
  // const searchText = "xxxxx";
  // const newText = await Nomor_surat.findOne({
  //   where: { id: nomor_surat_id },
  // });
  const tempDir = path.resolve(__dirname, "../../../../daftar_surat");

  // Check if the directory exists
  if (!fs.existsSync(tempDir)) {
    // If not, create the directory
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const finalFilePath = path.join(tempDir, daftar_surat.judul);
  fs.renameSync(filePath, finalFilePath);

  const filePath = path.join(tempDir, "tempFile");
  fs.writeFileSync(filePath, fileBuffer);

  const inputPath = finalFilePath;

  // Create 'acc' directory if it doesn't exist
  const accDir = path.join(tempDir, "acc");
  if (!fs.existsSync(accDir)) {
    fs.mkdirSync(accDir, { recursive: true });
  }

  const outputPath = path.join(
    accDir,
    `${daftar_surat.judul.replace(".pdf", "-acc.pdf")}`
  );

  const searchText = "xxxxx";
  const newText = await Nomor_surat.findOne({
    where: { id: nomor_surat_id },
  });

  try {
    await changeTextInPdfV2(
      inputPath,
      outputPath,
      searchText,
      newText.nomor_surat
    );

    const reqSuratUrl = {
      save: {
        file: fileBuffer,
        surat_id: surat_id,
      },
    };
    // const saveSuratUrl = putSuratUrl(reqSuratUrl);

    console.log("Perubahan teks pada PDF berhasil disimpan ke", outputPath); // pdf e aman kah
    return `Perubahan teks pada PDF berhasil disimpan`;
    // res.json(`Perubahan teks pada PDF berhasil disimpan ke ${outputPath}`);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json("Terjadi kesalahan dalam memproses teks di PDF, ", error);
  }
};

module.exports = { OCR };
