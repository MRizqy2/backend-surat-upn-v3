// const multer = require("../../../../../config/multerConfig");
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
  // filename: function (req, file, cb) {
  //   cb(null, req.body.judul + ".pdf");
  // },
  filename: function (req, file, cb) {
    console.log(",vw,ep[g");
    // Gunakan judul sebagai nama file
    const judul = req.body.judul || "default";
    // console.log("Judul:", req);
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
      url: surat.url, //tak coba e
    });

    // const thumbnailUrl = "";
    const judulExt = judul + path.extname(req.files["surat"][0].originalname);
    console.log("dawdaw", judulExt);

    const suratFile = req.files["surat"][0]; //
    console.log(",i,uttyj", suratFile);

    const suratUrl = `${suratFile.filename}`; //ini tadi kok gk storage/ws aman harusse
    console.log("ebfsv", suratUrl); // salah kui

    const downloadUrl = `${
      process.env.NGROK
    }/daftar-surat/multer/download/${encodeURIComponent(suratUrl)}`;
    console.log("akakakaksd", downloadUrl);
    const update_duplicate_surat = await Daftar_surat.update(
      {
        judul: judulExt,
        url: downloadUrl,
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
      //tak commit dulu
      where: { surat_id: surat.id },
      order: [["id", "DESC"]], // wokee
    });
    const nomor = nomor_surat.nomor_surat;
    console.log("adwjajjjs", nomor);
    const nomorSuratSplit = nomor.split("/");
    console.log(".io.ouk", nomorSuratSplit); //.io.ouk [ '0008', 'UN63.7', 'ST', 'TU-SD', '2024' ]

    if (nomorSuratSplit.length === 5) {
      updateNomorSurat = `${nomorSuratSplit[0]}/1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
      console.log(".io.ouk", updateNomorSurat);
    } else if (nomorSuratSplit.length === 6) {
      nomorRevisi = parseInt(nomorSuratSplit[1], 10);
      console.log("i.k,k,t", nomorRevisi);
      nomorRevisi++;
      updateNomorSurat = `${nomorSuratSplit[0]}/${nomorRevisi}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}/${nomorSuratSplit[5]}`;
    }
    console.log("ojvro", nomorRevisi); //nama duplikat e opo// wakwak gk ono file e/emg eror opo/ iyo kah? bukan pas upload surat e?/woke
    const stringNomorSurat = String(updateNomorSurat); //ketemu masalah e
    const save_nomor_surat = await Nomor_surat.create({
      // opo kui//iyo
      nomor_surat: stringNomorSurat, //url = https://9d82-158-140-171-95.ngrok-free.app/daftar-surat/multer/download/836c2ae0-1706376614747-bisabisa2-acc.pdf
      surat_id: duplicate_surat.id, //judul = acc-bisabisa2.pdf//hmmm/ tapi iku isok didownlload sg salah mek judul nak db
      periode_id: nomor_surat.periode_id, // jer kok bedo// opo download sing nek atas kui// perarti pas disetujui dekan awal awal?
    });
    console.log("klklklk");
    const reqOcr = {
      save: {
        nomor_surat_id: save_nomor_surat.id,
        surat_id: duplicate_surat.id,
        from: `daftar_surat_controller/multer_controller/put_multer_revisi`,
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
