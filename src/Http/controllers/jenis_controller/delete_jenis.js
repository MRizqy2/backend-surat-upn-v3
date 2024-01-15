const express = require("express");
const { Jenis_surat } = require("../../../models");
const router = express.Router();

const deleteJenis = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Parameter 'id' is required" });
    }

    const HapusJenis = await Jenis_surat.destroy({
      where: { id: id },
    });

    if (HapusJenis) {
      res.status(200).json({ message: "Jenis Surat deleted successfully" });
    } else {
      res.status(404).json({ error: "Jenis Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteJenis);
module.exports = { router, deleteJenis };
