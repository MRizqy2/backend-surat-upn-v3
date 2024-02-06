const express = require("express");
const { INDIKATOR } = require("../../../models/");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const postIndikator = async (req, res) => {
  try {
    const { nama, nomor, strategi_id } = req.body;
    const indikator = await INDIKATOR.create({
      nama,
      nomor,
      strategi_id,
    });
    res.status(StatusCodes.CREATED).json(indikator);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/", postIndikator);

module.exports = {
  postIndikator,
};
