const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../../ocr_controller/ocr_controller");
const { Daftar_surat, Nomor_surat } = require("../../../../models");
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

const revisi = async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const { surat_id } = req.query;

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });

    const duplicate_surat = await Daftar_surat.create({
      judul: surat.judul,
      thumbnail: surat.thumbnail,
      jenis_id: surat.jenis_id,
      user_id: surat.user_id,
      deskripsi: surat.deskripsi,
      tanggal: surat.tanggal,
      url: surat.url,
    });

    if (req.files["surat"]) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: getResourceType(req.files.surat[0].originalname),
              public_id: path.parse(req.files.surat[0].originalname),
            },
            (error, result) => {
              if (error) reject(error);
              else {
                suratUrl = result.url;
                resolve(result);
              }
            }
          )
          .end(req.files.surat[0].buffer);
      });
    }

    const suratUrlHttps = suratUrl.replace(/^http:/, "https:");

    const update_duplicate_surat = await Daftar_surat.update(
      {
        judul: judul,
        url: suratUrlHttps,
        // jenis_id: jenis.id || "",
        deskripsi: deskripsi || "",
        // thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: duplicate_surat.id }, // Gantilah dengan kriteria yang sesuai
        returning: true, // Menambahkan opsi returning
      }
    );

    const nomor_surat = await Nomor_surat.findOne({
      where: { surat_id: surat.id },
      order: [["id", "DESC"]],
    });
    const nomor = nomor_surat.nomor_surat;
    const nomorSuratSplit = nomor.split("/");

    const updateNomorSurat = `${nomorSuratSplit[0]}/A/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}`;
    const stringNomorSurat = String(updateNomorSurat);
    const save_nomor_surat = await Nomor_surat.create({
      nomor_surat: stringNomorSurat,
      surat_id: duplicate_surat.id,
      periode_id: nomor_surat.periode_id,
    });
    //`SELECT "id", "nomor_surat", "surat_id", "periode_id", "createdAt",
    //"updatedAt" FROM "Nomor_surats" AS "Nomor_surat" WHERE "Nomor_surat"."id" = '9/A/UN 63.7/TU_IF/2024';`
    const reqOcr = {
      save: {
        nomor_surat_id: save_nomor_surat.id,
        surat_id: duplicate_surat.id,
        from: `daftar_surat_controller/cloudinary_controller/put_clodinary_revisi`,
      },
    };
    console.log("ii/oi", duplicate_surat.id);
    const saveOcr = await OCR(reqOcr);
    if (!saveOcr) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save OCR" });
    }
    console.log("pvwmvp");
    res.json(`sukses`);
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.put(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  revisi
);

module.exports = router;
