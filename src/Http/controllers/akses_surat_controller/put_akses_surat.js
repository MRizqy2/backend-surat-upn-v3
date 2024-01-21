const express = require("express");
const { Akses_surat } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putAksesSurat = async (req, res) => {
  try {
    const { surat_id, jabatan_id } = req.body;
    const { akses_surat_id } = req.query;

    const akses_surat = await Akses_surat.findOne({
      where: { id: akses_surat_id },
    });
    const updateAksesSurat = await Akses_surat.update(
      {
        surat_id,
        jabatan_id: jabatan_id,
      },
      { where: { id: akses_surat_id }, returning: true }
    );
    res.status(StatusCodes.OK).json({ updated: updateAksesSurat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.put("/", putAksesSurat);

module.exports = {
  putAksesSurat,
  router,
};
