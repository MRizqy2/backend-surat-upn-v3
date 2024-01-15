const express = require("express");
const { Fakultas } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();
const { Op } = require("sequelize");

const deleteFakultas =
  (isAdmin,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Parameter id is required" });
      }

      const deletedFakultas = await Fakultas.destroy({
        where: { id: id },
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
  });

router.delete("/", isAdmin, deleteFakultas);

module.exports = {
  deleteFakultas,
  router,
};
