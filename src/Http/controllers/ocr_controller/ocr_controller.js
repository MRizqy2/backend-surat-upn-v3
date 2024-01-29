const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { changeTextInPdfV2 } = require("./post_coordinate_controller");
const { putSuratUrl } = require("./put_surat_url_multer");
const { StatusCodes } = require("http-status-codes"); // Tambahkan import StatusCodes
const { Nomor_surat, Daftar_surat } = require("../../../models");

const OCR = async (req, res) => {
  try {
    const { nomor_surat_id, surat_id } = req.save;
    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    if (!surat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Daftar Surat not found" });
    }

    const fileName = surat.url.split("/").pop();

    const fileBuffer = fs.readFileSync(`daftar_surat/${fileName}`);

    const tempDir = path.resolve("daftar_surat/");

    // Check if the directory exists
    if (!fs.existsSync(tempDir)) {
      // If not, create the directory
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, "tempFile");
    fs.writeFileSync(filePath, fileBuffer);

    const finalFilePath = path.join(tempDir, fileName);

    fs.renameSync(filePath, finalFilePath);

    const inputPath = finalFilePath;

    let fileNameWithoutExtension = fileName;
    console.log("fileNameWithoutExtension = ", fileNameWithoutExtension);
    if (!fileName.endsWith("-acc.pdf")) {
      fileNameWithoutExtension = fileName.replace(".pdf", "-acc.pdf"); // Ganti ekstensi .pdf dengan -acc.pdf
    }
    const outputPath = path.join(tempDir, fileNameWithoutExtension);
    const searchText = "xxxxx";
    const newText = await Nomor_surat.findOne({
      where: { id: nomor_surat_id },
    });
    const savePdf = await changeTextInPdfV2(
      inputPath,
      outputPath,
      searchText,
      newText.nomor_surat
    );
    const reqSuratUrl = {
      body: {
        outputPath,
        surat_id,
      },
    };
    const saveSuratUrl = await putSuratUrl(reqSuratUrl);

    console.log("Perubahan teks pada PDF berhasil disimpan ke", outputPath);
    return newText;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};

router.post("/", OCR); // Ganti 'app.post' menjadi 'router.post'

module.exports = { router, OCR };
