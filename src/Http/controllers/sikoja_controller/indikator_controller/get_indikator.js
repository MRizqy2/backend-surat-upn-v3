const { INDIKATOR } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();

const getIndikator = async (req, res) => {
  try {
    const { indikator_id } = req.query;

    if (!indikator_id) {
      // Mendapatkan semua data
      const allData = await INDIKATOR.findAll({ order: [["id", "ASC"]] });
      res.send(allData);
    } else if (indikator_id) {
      // Mendapatkan data berdasarkan ID
      const findOneData = await INDIKATOR.findOne({
        where: { id: indikator_id },
      });

      if (findOneData) {
        res.send(findOneData);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Data not found" });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.get("/", getIndikator);

module.exports = { router, getIndikator };
