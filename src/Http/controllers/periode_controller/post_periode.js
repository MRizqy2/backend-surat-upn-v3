const express = require("express");
const { Periode } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("./../../middleware/adminMiddleware");
const router = express.Router();

const postPeriode = async (req, res) => {
  const { tahun } = req.body;
  try {
    const periode = await Periode.create({
      tahun,
      status: true,
    });
    res.status(StatusCodes.CREATED).json({
      message: `created successfully`,
      periode,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postPeriode, isAdmin);

module.exports = {
  postPeriode,
  router,
};
