const express = require("express");
const { Fakultas } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { Op } = require("sequelize");

const deleteFakultas = async (req, res) => {
  try {
    const { fakultas_id } = req.query;

    if (!fakultas_id) {
      return res.status(400).json({ error: "Parameter id is required" });
    }

    const deletedFakultas = await Fakultas.destroy({
      where: { id: fakultas_id },
    });

    if (deletedFakultas) {
      res.status(200).json({ message: "Fakultas deleted successfully" });
    } else {
      res.status(404).json({ error: "Fakultas not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteFakultas);

module.exports = {
  deleteFakultas,
  router,
};
