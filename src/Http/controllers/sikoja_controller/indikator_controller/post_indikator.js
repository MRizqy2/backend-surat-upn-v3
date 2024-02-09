const express = require("express");
const router = express.Router();
const { INDIKATOR } = require("../../../models/");
const { StatusCodes } = require("http-status-codes");

const postIndikator = async (req, res) => {
  try {
    const { name, nomor } = req.body;
    const indikator = await INDIKATOR.create({
      name,
      nomor,
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
  router,
};
