const express = require("express");
const {
  Daftar_surat,
  Template_surat,
  Jabatan,
  Users,
  Jenis_surat,
} = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { postStatus } = require("../../status_surat_controller/post_status");
const {
  postTampilan,
} = require("../../tampilan_surat_controller/post_tampilan");
const { postNotif } = require("../../notifikasi_controller/post_notifikasi");
const { send } = require("./../send_controller");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "daftar_surat/thumbnail/"
      : "daftar_surat/";

    cb(null, destinationPath);
  },
  // filename: function (req, file, cb) {
  //   cb(null, req.body.judul + ".pdf");
  // },
  filename: function (req, file, cb) {
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

const postMulter = async function (req, res) {
  try {
    const { judul, jenis_id, deskripsi } = req.body;
    const suratFile = req.files["surat"][0];
    const thumbnailUrl = "";
    const judulExt = judul + path.extname(suratFile.originalname);
    const suratUrl = `${suratFile.filename}`;
    const downloadUrl = `${
      process.env.NGROK
    }/daftar-surat/multer/download/${encodeURIComponent(suratUrl)}`;
    const jenis = await Jenis_surat.findOne({
      where: { id: jenis_id },
    });

    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });

    // const decoded = jwt.verify(token, secretKey);
    // const user_id = decoded.id;
    const daftar_surat = await Daftar_surat.create({
      judul: judulExt,
      thumbnail: thumbnailUrl || "",
      jenis_id: jenis.id || "",
      user_id: req.token.id,
      deskripsi: deskripsi || "",
      tanggal: Date(),
      url: downloadUrl,
    });

    const reqStatus = {
      body: {
        user_id: user.id,
        surat_id: daftar_surat.id,
        from: `daftar_surat_controller/multer_controller`,
      },
    };
    const saveStatus = await postStatus(reqStatus);

    const reqTampilan = {
      body: {
        jabatan_id: jabatan.id,
        // user_id: user.id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/multer_controller",
      },
      token: req.token,
    };

    await postTampilan(reqTampilan);
    const reqTampilan2 = {
      body: {
        jabatan_id: jabatan.jabatan_atas_id,
        // user_id: user.id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/multer_controller",
      },
      token: req.token,
    };
    await postTampilan(reqTampilan2);

    let reqSend;
    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.jabatan_atas_id,
        from: "daftar_surat_controller/multer_controller",
      },
    };
    await send(reqSend); //akses

    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.id,
        from: "daftar_surat_controller/multer_controller",
      },
    };
    await send(reqSend);

    const reqNotif = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id_dari: jabatan.id,
        jabatan_id_ke: jabatan.jabatan_atas_id,
        from: `daftar_surat_controller/multer_controller/post_multer_upload`,
      },
    };
    await postNotif(reqNotif);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", daftar_surat });
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  postMulter
);

module.exports = router;
