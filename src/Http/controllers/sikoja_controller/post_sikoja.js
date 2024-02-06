const express = require("express");
const { SIKOJA } = require("../../../models/");
const multer = require("multer");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destination = `sikoja/`;
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

const postSikoja = async (req, res) => {
  try {
    const { nomor_surat, url, indikator_id } = req.body;
    const suratFile = req.files["surat"][0];
    const judul = suratFile.filename;

    const saveSikoja = await SIKOJA.create({
      judul,
      nomor_surat,
      url,
      indikator_id,
    });

    res.status(StatusCodes.OK).json(saveSikoja);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/", upload.fields([{ name: "surat", maxCount: 1 }]), postSikoja);

module.exports = { postSikoja, router };
