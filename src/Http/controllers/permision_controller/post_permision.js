const express = require("express");
const { Akses_master, Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postPermision = async (req, res) => {
  const {
    jabatan_id,
    buat_surat,
    download_surat,
    generate_nomor_surat,
    upload_tandatangan,
    persetujuan,
  } = req.body;
  try {
    // Dapatkan ID terakhir dari tabel Permision
    const latestPermision = await Akses_master.findOne({
      order: [["id", "DESC"]],
    });
    // Tentukan ID yang baru
    const latestPermisionId = latestPermision ? latestPermision.id : 0;
    const newPermisionId = latestPermisionId + 1;

    // Buat data Permision dengan ID yang baru
    const permision = await Permision.create({
      id: newPermisionId,
      jabatan_id,
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
    });
    if (req.body.from) {
      return permision;
    } else {
      res.status(StatusCodes.CREATED).json({
        message: `created permision successfully`,
        permision,
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

router.post("/", postPermision);

module.exports = {
  postPermision,
  router,
};
