const express = require("express");
const { INDIKATOR } = require("../../../models/");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const deleteIndikator = async (req, res) => {
  try {
    const { indikator_id } = req.query;

    // Gunakan findByPk untuk mencari berdasarkan primary key
    const indikator = await INDIKATOR.findByPk(indikator_id);

    // Periksa apakah indikator ditemukan
    if (!indikator) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Indikator not found" });
    }

    // Hapus indikator
    await indikator.destroy();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Indikator has been deleted" });
  } catch (error) {
    // Tangani kesalahan dengan mengembalikan status 500
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { deleteIndikator };
