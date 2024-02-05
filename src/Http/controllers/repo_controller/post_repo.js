const express = require("express");
const router = express.Router();
const {
  REPO,
  USERS,
  JABATAN,
  FAKULTAS,
  PRODI,
  JENIS_SURAT,
  FOLDER,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const folder = await FOLDER.findOne({
      where: { id: req.body.folder_id },
    });
    const destination = `repo/${folder.name}`;
    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const judul = file.originalname || "default";
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}-${judul}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const postRepo = async (req, res) => {
  try {
    const { nomor_surat, jenis_id, folder_id } = req.body;

    const suratFile = req.files["surat"][0];
    const suratPath = `${suratFile.destination}`;
    const judul = suratFile.filename;
    let pathFile = path.join(suratPath, judul);
    pathFile = pathFile.replaceAll(" ", "%20");
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const jenis = await JENIS_SURAT.findOne({
      where: { id: jenis_id },
    });

    const prodi = await PRODI.findOne({
      where: { id: user.prodi_id },
    });
    const fakultas = await FAKULTAS.findOne({
      where: { id: user.fakultas_id },
    });

    const folder = await FOLDER.findOne({
      where: { id: folder_id },
    });

    // let data_user = `${user.id}/${user.name}/${jabatan.name}/${prodi.name}/${fakultas.name}`;
    const data_user = JSON.stringify({
      id: user.id,
      name: user.name,
      jabatan: jabatan.name,
      prodi: prodi.name,
      fakultas: fakultas.name,
    });
    const repo = await REPO.create({
      judul,
      nomor_surat,
      jenis: jenis.jenis,
      data_user: data_user,
      tanggal: Date.now(),
      path: pathFile,
      folder_id: folder.id,
    });
    res.status(StatusCodes.OK).json({ message: `repo telah dibuat`, repo });
    // res.json( `repo telah dibuat`);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    // { name: "thumbnail", maxCount: 1 },
  ]),
  postRepo
);

module.exports = { postRepo, router };
