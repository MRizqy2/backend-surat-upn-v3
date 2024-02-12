const express = require("express");
const { PERBAIKAN, DAFTAR_SURAT, KOMENTAR } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const postUploadSurat = require("../daftar_surat_controller/multer_controller/post_multer_upload");

const router = express.Router();

const postPerbaikan = async (req, res) => {
  try {
    const { surat_id } = req.body;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const komentar = await KOMENTAR.findOne({
      where: { surat_id: surat.id },
    });

    const savePerbaikan = await PERBAIKAN.create({
      surat_id: surat.id,
      perbaikan: komentar.komentar,
    });

    router.use(postUploadSurat);

    return "sukses perbaikan";
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postPerbaikan);

module.exports = {
  postPerbaikan,
  router,
};
