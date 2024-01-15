const express = require("express");
const { Fakultas } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const postFakultas = async (req, res) => {
  const { name, jenjang, kode_fakultas } = req.body;

  try {
    const latestFakultas = await Fakultas.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const latestFakultasId = parseInt(latestFakultas[0].id, 10);

    const fakultas = await Fakultas.create({
      id: latestFakultasId + 1,
      name,
      jenjang,
      kode_fakultas,
    });
    res.status(StatusCodes.CREATED).json({
      message: `${
        (fakultas.name, fakultas.jenjang, fakultas.kode_fakultas)
      } created successfully`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", isAdmin, postFakultas);

module.exports = {
  postFakultas,
  router,
};