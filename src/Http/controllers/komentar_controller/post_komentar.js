const express = require("express");
const { Komentar, Users, Jabatan, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const jabatan = require("../../../models/jabatan");
const router = express.Router();

const postKomentar = async function (req, res) {
  try {
    const { komentar, surat_id } = req.body;
    // tak upload surat baru
    //wokeh
    const user = await Users.findOne({ where: { id: req.token.id } });
    const surat = await Daftar_surat.findOne({ where: { id: surat_id } });
    const user_surat = await Users.findOne({ where: { id: surat.id } });

    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });

    const komen = await Komentar.create({
      surat_id,
      jabatan_id_dari: user.jabatan_id,
      jabatan_id_ke: user_surat.jabatan_id,
      komentar,
    });
    // await Daftar_surat.update(
    //   {
    //     komentar_id: komen.id,
    //   },
    //   {
    //     where: { id: surat_id },
    //   }
    // );

    // // Fetch Daftar_surat with included Komentar
    // const updatedSurat = await Daftar_surat.findOne({
    //   where: { id: surat_id },
    //   include: [{ model: Komentar, as: "komentar" }],
    //   attributes: {
    //     exclude: ["komentar_id"],
    //   },
    // });

    return res.json({ message: "Berhasil", komen });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", postKomentar);

module.exports = {
  postKomentar,
  router,
};
