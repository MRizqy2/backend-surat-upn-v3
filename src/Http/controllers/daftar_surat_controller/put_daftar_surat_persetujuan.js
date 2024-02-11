const express = require("express");
const router = express.Router();
const { DAFTAR_SURAT, USERS, JABATAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const putPersetujuan = async (req, res) => {
  try {
    const { status, persetujuan } = req.body;
    const { id } = req.query;
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    const surat_per = await DAFTAR_SURAT.update(
      {
        persetujuan,
        status,
      },
      {
        where: { id: id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ surat: surat_per });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.get("/persetujuan", putPersetujuan);

module.exports = {
  router,
  putPersetujuan,
};
