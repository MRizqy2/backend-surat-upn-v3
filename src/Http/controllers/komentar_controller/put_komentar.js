const express = require("express");
const { Komentar, Users, Jabatan, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putKomentar = async function (req, res) {
  try {
    const { komentar, surat_id } = req.body;
    const { komentar_id } = req.query;

    const user = await Users.findOne({ where: { id: req.token.id } });
    const surat = await Daftar_surat.findOne({ where: { id: surat_id } });
    const user_surat = await Users.findOne({ where: { id: surat.user_id } });

    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });
    const updatedKomenar = await Komentar.update(
      {
        surat_id,
        jabatan_id_dari: user.jabatan_id,
        jabatan_id_ke: user_surat.jabatan_id,
        komentar,
      },
      {
        where: { id: komentar_id },
        returning: true,
      }
    );
    return res.json({ message: "Berhasil", updatedKomenar });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putKomentar);

module.exports = {
  putKomentar,
  router,
};
