const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
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
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "daftar_surat/thumbnail/"
      : "daftar_surat/";

    cb(null, destinationPath);
    console.log("mvew[v");
  },

  filename: function (req, file, cb) {
    console.log(",vw,ep[g");
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

const upload = multer({ storage: storage });

const revisi = async (req, res) => {
  try {
    let updateNomorSurat, i, nomorRevisi;
    const { judul, deskripsi } = req.body;
    const { surat_id } = req.query;

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    console.log("jshdjaw", surat.judul);
    const duplicate_surat = await Daftar_surat.create({
      judul: surat.judul,
      thumbnail: surat.thumbnail,
      jenis_id: surat.jenis_id,
      user_id: surat.user_id,
      deskripsi: surat.deskripsi,
      tanggal: surat.tanggal,
      url: surat.url,
    });

    const judulExt = judul + path.extname(req.files["surat"][0].originalname);

    const suratFile = req.files["surat"][0];

    const suratUrl = `${suratFile.filename}`;

    const downloadUrl = `${
      process.env.NGROK
    }/daftar-surat/multer/download/${encodeURIComponent(suratUrl)}`;
    const update_duplicate_surat = await Daftar_surat.update(
      {
        judul: judulExt,
        url: downloadUrl,
        deskripsi: deskripsi || "",
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

    if (nomorSuratSplit.length === 5) {
      updateNomorSurat = `${nomorSuratSplit[0]}/1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    } else if (nomorSuratSplit.length === 6) {
      nomorRevisi = parseInt(nomorSuratSplit[1], 10);
      nomorRevisi++;
      updateNomorSurat = `${nomorSuratSplit[0]}/${nomorRevisi}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}/${nomorSuratSplit[5]}`;
    }
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
        from: `daftar_surat_controller/multer_controller/put_multer_revisi`,
      },
    };
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
      const duplicate_akses_surat = await Akses_surat.create({
        surat_id: duplicate_surat.id,
        jabatan_id: akses_surat[i].jabatan_id,
      });
    }

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
