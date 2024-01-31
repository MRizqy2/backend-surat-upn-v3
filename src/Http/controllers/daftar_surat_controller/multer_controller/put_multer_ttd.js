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
const { putStatus } = require("../../status_surat_controller/put_status");
const { postNotif } = require("../../notifikasi_controller/post_notifikasi");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isThumbnail = file.fieldname === "thumbnail";
    const destinationPath = isThumbnail
      ? "daftar_surat/thumbnail/"
      : "daftar_surat/";

    cb(null, destinationPath);
  },

  filename: async function (req, file, cb) {
    // Gunakan judul sebagai nama file
    const data_surat = await Daftar_surat.findOne({
      where: { id: req.query.surat_id }, //https://0ae6-158-140-171-95.ngrok-free.app/daftar-surat/multer/download/undefined
    });
    console.log("opokdq", req.query.surat_id); //opokdq 7
    const judul = data_surat.judul; //tak nyba si//ga iso delok ey// coba judul e
    console.log("adwdasdwa", judul);
    const timestamp = Date.now(); //jek gk bisa/linknya gk ketemu/>Cannot PUT /daftar-surat/multer/ttd
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}-${judul}`;
    cb(null, filename); //
  },
});

const upload = multer({ storage: storage }); //enek sing erro kui nek put surat url multer

const putMulterTtd = async function (req, res) {
  try {
    const { surat_id } = req.query;
    if (!req.files["surat"]) {
      //gk mlaku lek mok ilangin 0 le
      //
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing files in request" });
    }
    const thumbnailUrl = "";
    const suratUrl = `${req.files["surat"][0].filename}`;
    console.log("dawdadw", suratUrl); //pdf.pdf hasill
    const downloadUrl = `${
      process.env.NGROK
    }/daftar-surat/multer/download/${encodeURIComponent(suratUrl)}`;

    const data_surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    if (!data_surat) {
      return res.status(404).json({ error: "Data surat not found" });
    }
    const user_surat = await Users.findOne({
      where: { id: data_surat.user_id },
    });

    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const updateSurat = await Daftar_surat.update(
      {
        url: downloadUrl,
        thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: surat_id }, // Gantilah dengan kriteria yang sesuai
        returning: true, // Menambahkan opsi returning
      }
    );

    const reqStatus = {
      body: {
        user: user,
        isSigned: true,
        from: "daftar_surat_controller/multer_controller/put_multer_update.js",
      },
      query: {
        surat_id: surat_id,
      },
      token: req.token,
    };
    const saveStatus = await putStatus(reqStatus);

    const reqNotif = {
      body: {
        surat_id: data_surat.id,
        jabatan_id_dari: user.jabatan_id,
        jabatan_id_ke: user_surat.jabatan_id,
        from: `daftar_surat_controller/multer_controller/put_multer_ttd`,
      },
    };
    await postNotif(reqNotif);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", updateSurat });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  putMulterTtd
);

module.exports = router;