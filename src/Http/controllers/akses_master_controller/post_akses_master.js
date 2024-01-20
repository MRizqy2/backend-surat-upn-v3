const express = require("express");
const { Akses_master, Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postAksesMaster = async (req, res) => {
  const {
    permision_id,
    prodi,
    template,
    periode,
    fakultas,
    jabatan,
    jenis_surat,
  } = req.body;

  try {
    // Dapatkan ID terakhir dari tabel Akses_masters
    const latestAksesMaster = await Akses_master.findOne({
      order: [["id", "DESC"]],
    });

    // Tentukan ID yang baru
    const latestAksesMasterId = latestAksesMaster ? latestAksesMaster.id : 0;
    const newAksesMasterId = latestAksesMasterId + 1;

    // Buat data Akses_master dengan ID yang baru
    const akses_master = await Akses_master.create({
      id: newAksesMasterId,
      permision_id,
      prodi,
      template,
      periode,
      fakultas,
      jabatan,
      jenis_surat,
    });

    if (req.body.from) {
      return akses_master;
    } else {
      res.status(StatusCodes.CREATED).json({
        message: `created Akses Master successfully`,
        akses_master,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postAksesMaster);

module.exports = {
  postAksesMaster,
  router,
};
