const express = require("express");
const { Periode } = require("../../../models");
const router = express.Router();

const deletePeriode = async (req, res) => {
  try {
    const { periode_id } = req.query;

    if (!periode_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'periode_id' is required" });
    }

    const hapusPeriode = await Periode.destroy({
      where: { id: periode_id },
    });

    if (hapusPeriode) {
      res
        .status(200)
        .json({ message: "Periode Surat deleted successfully" });
    } else {
      res.status(404).json({ error: "Periode Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deletePeriode);
module.exports = { router, deletePeriode };