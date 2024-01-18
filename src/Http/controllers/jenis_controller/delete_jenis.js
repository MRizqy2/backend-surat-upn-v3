const express = require("express");
const { Jenis_surat } = require("../../../models");
const router = express.Router();

const deleteJenis = async (req, res) => {
  try {
    const { jenis_id } = req.query;

    if (!jenis_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'jenis_id' is required" });
    }

    const HapusJenis = await Jenis_surat.destroy({
      where: { id: jenis_id },
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
