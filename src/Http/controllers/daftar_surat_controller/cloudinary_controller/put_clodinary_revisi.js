const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../../ocr_controller/ocr_controller");
const {
  Daftar_surat,
  Nomor_surat,
  Akses_surat,
  Status,
  Tampilan,
} = require("../../../../models");
const jabatan = require("../../../../models/jabatan");
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
    let updateNomorSurat, i, nomorRevisi;
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
    const judulExt = judul + path.extname(req.files["surat"][0].originalname);
    const update_duplicate_surat = await Daftar_surat.update(
      {
        judul: judulExt,
        url: suratUrlHttps,
        // jenis_id: jenis.id || "",
        deskripsi: deskripsi || "",
        // thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: duplicate_surat.id },
        returning: true,
      }
    );

    const nomor_surat = await Nomor_surat.findOne({
      where: { surat_id: surat.id },
      order: [["id", "DESC"]],
    });
    const nomor = nomor_surat.nomor_surat;
    const nomorSuratSplit = nomor.split("/");
    console.log(".io.ouk");
    if (nomorSuratSplit.length === 4) {
      updateNomorSurat = `${nomorSuratSplit[0]}/1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}`;
    } else if (nomorSuratSplit.length === 5) {
      nomorRevisi = parseInt(nomorSuratSplit[1], 10);
      console.log("i.k,k,t", nomorRevisi);
      nomorRevisi++;
      updateNomorSurat = `${nomorSuratSplit[0]}/${nomorRevisi}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    }
    console.log("ojvro", nomorRevisi);
    const stringNomorSurat = String(updateNomorSurat);
    const save_nomor_surat = await Nomor_surat.create({
      nomor_surat: stringNomorSurat,
      surat_id: duplicate_surat.id,
      periode_id: nomor_surat.periode_id,
    });

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

    const akses_surat = await Akses_surat.findAll({
      where: { surat_id: surat.id },
    });
    for (i = 0; i < akses_surat.length; i++) {
      console.log("porvpo", i);
      const duplicate_akses_surat = await Akses_surat.create({
        surat_id: duplicate_surat.id,
        jabatan_id: akses_surat[i].jabatan_id,
      });
      console.log("vegweg", duplicate_akses_surat.id);
    }
    console.log("porvpo");
    const status_surat = await Status.findOne({
      where: { surat_id: surat.id },
    });

    const duplicate_status_surat = await Status.create({
      surat_id: duplicate_surat.id,
      status: status_surat.status,
      persetujuan: status_surat.persetujuan,
    });

    const tampilan_surat = await Tampilan.findAll({
      where: { surat_id: surat.id },
    });
    for (i = 0; i < tampilan_surat.length; i++) {
      const duplicate_tampilan_surat = await Tampilan.create({
        pin: tampilan_surat[i].pin,
        dibaca: tampilan_surat[i].dibaca,
        surat_id: duplicate_surat.id,
        jabatan_id: tampilan_surat[i].jabatan_id,
      });
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
