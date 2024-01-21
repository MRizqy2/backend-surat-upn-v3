const express = require("express");
const { Prodi } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getProdi = async (req, res) => {
  const { prodi_id } = req.query;

  try {
    let prodi;

    if (!prodi_id) {
      prodi = await Prodi.findAll({
        order: [["id", "ASC"]],
      });
    } else {
      prodi = await Prodi.findOne({
        where: { id: prodi_id },
        order: [["id", "ASC"]],
      });
    }
    if (!req.body.from) {
      res.status(StatusCodes.OK).json(prodi); // Mengirim data prodi ke klien
    } else {
      return prodi;
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.get("/", getProdi);

module.exports = {
  getProdi,
  router,
};
