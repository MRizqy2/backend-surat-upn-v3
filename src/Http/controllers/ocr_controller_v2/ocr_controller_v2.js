const express = require("express");
const router = express.Router(); // Ganti 'app' dengan 'router'
const multer = require("multer");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { changeTextInPdfV2 } = require("./post_coordinate_controller");
const { putSuratUrl } = require("./put_surat_url");
const { StatusCodes } = require("http-status-codes"); // Tambahkan import StatusCodes
const { Nomor_surat, Daftar_surat } = require("../../../models");

const OCR = async (req, res) => {
  try {
    const { nomor_surat_id, surat_id } = req.save;
    const daftar_surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    if (!daftar_surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Daftar Surat not found" });
    }

    // const fileName = daftar_surat.judul;
    const fileName = path.basename(daftar_surat.judul);
    const downloadUrl = `${daftar_surat.url}?attachment=${encodeURIComponent(
      fileName
    )}`;

    // Download file dari Cloudinary
    const response = await fetch(downloadUrl);
    const fileBuffer = await response.buffer();

    const tempDir = path.resolve(__dirname, "../../../../daftar_surat");

    // Check if the directory exists
    if (!fs.existsSync(tempDir)) {
      // If not, create the directory
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, "tempFile");
    fs.writeFileSync(filePath, fileBuffer);

    // const finalFilePath = path.join(tempDir, daftar_surat.judul);
    const finalFilePath = path.join(tempDir, fileName);

    fs.renameSync(filePath, finalFilePath);

    const inputPath = finalFilePath;

    // Create 'acc' directory if it doesn't exist
    const accDir = path.join(tempDir, "acc");
    if (!fs.existsSync(accDir)) {
      fs.mkdirSync(accDir, { recursive: true });
    }

    // const outputPath = path.join(
    //   accDir,
    //   `${daftar_surat.judul.replace(".pdf", "-acc.pdf")}`
    // );

    const fileNameWithoutExtension = fileName.replace(".pdf", "-acc.pdf"); // Ganti ekstensi .pdf dengan -acc.pdf
    const outputPath = path.join(accDir, fileNameWithoutExtension);

    const searchText = "xxxxx";
    const newText = await Nomor_surat.findOne({
      where: { id: nomor_surat_id },
    });

    await changeTextInPdfV2(
      inputPath,
      outputPath,
      searchText,
      newText.nomor_surat
    );
    const reqSuratUrl = {
      save: {
        outputPath,
        surat_id,
      },
    };
    await putSuratUrl(reqSuratUrl);

    console.log("Perubahan teks pada PDF berhasil disimpan ke", outputPath);
    return newText;
    // res.status(StatusCodes.OK).json("Perubahan teks pada PDF berhasil disimpan");
  } catch (error) {
    console.error("Error:", error);
    return error;
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json("Terjadi kesalahan dalam memproses teks di PDF");
  }
};

router.post("/", OCR); // Ganti 'app.post' menjadi 'router.post'

module.exports = { router, OCR };
