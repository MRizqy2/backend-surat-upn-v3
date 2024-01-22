const express = require("express");
const { Prodi } = require("../../../models");
const router = express.Router();

const deleteProdi = async (req, res) => {
  try {
    const { prodi_id } = req.query;

    if (!prodi_id) {
      return res.status(400).json({ error: "Parameter prodi_id is required" });
    }

    const deletedProdi = await Prodi.destroy({
      where: { id: prodi_id },
    });

    if (deletedProdi) {
      res.status(200).json({ message: "Prodi deleted successfully" });
    } else {
      res.status(404).json({ error: "Prodi not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteProdi);

module.exports = {
  deleteProdi,
  router,
};
