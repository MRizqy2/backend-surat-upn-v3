const express = require("express");
const { AKSES_MASTER } = require("../../../models");
const router = express.Router();

const getAksesMaster = async (req, res) => {
  try {
    const { akses_master_id } = req.query;

    if (!akses_master_id) {
      // Mendapatkan semua data
      const allData = await AKSES_MASTER.findAll({
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (akses_master_id) {
      // Mendapatkan data berdasarkan ID
      const findOneData = await AKSES_MASTER.findOne({
        where: { id: akses_master_id },
      });

      if (findOneData) {
        res.send(findOneData);
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.get("/", getAksesMaster);
module.exports = {
  getAksesMaster,
  router,
};
