const express = require("express");
const router = express.Router();
const { SIKOJA } = require("../../../models/");
const { StatusCodes } = require("http-status-codes"); // Perlu menambahkan import yang kurang

const getSikoja = async (req, res) => {
  try {
    const { sikoja_id } = req.query;

    if (!sikoja_id) {
      // Mendapatkan semua data
      const allData = await SIKOJA.findAll({ order: [["id", "ASC"]] });
      res.send(allData);
    } else if (sikoja_id) {
      // Mendapatkan data berdasarkan ID
      const findOneData = await SIKOJA.findOne({
        where: { id: sikoja_id },
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
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getSikoja);

module.exports = { getSikoja, router };
