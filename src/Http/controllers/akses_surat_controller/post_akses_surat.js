const express = require("express");
const { Akses_surat, Daftar_surat } = require("../../../models");
const router = express.Router();

const postAksesSurat = async (req, res) => {
  const { surat_id, tambah_akses_id } = req.body;
  const surat = await Daftar_surat.findOne({
    where: { id: surat_id },
  });
  console.log("movdpw", tambah_akses_id);
  const saveAkses = await Akses_surat.create({
    surat_id,
    jabatan_id: tambah_akses_id,
  });

  if (!req.body.from) {
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Tambah akses successfully uploaded" });
  } else {
    return saveAkses;
  }
};
router.post("/", postAksesSurat);

module.exports = {
  postAksesSurat,
  router,
};
