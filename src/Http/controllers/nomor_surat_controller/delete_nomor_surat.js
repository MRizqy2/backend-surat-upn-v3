const express = require("express");
const { Nomor_surat } = require("../../../models");
const router = express.Router();

const deleteNomorSurat = async (req, res) => {
  try {
    const { nomor_surat_id } = req.query;

    if (!nomor_surat_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'nomor_surat_id' is required" });
    }

    const hapusNomorSurat = await Nomor_surat.destroy({
      where: { id: nomor_surat_id },
    });

    if (hapusNomorSurat) {
      res
        .status(200)
        .json({ message: "Nomor_surat Surat deleted successfully" });
    } else {
      res.status(404).json({ error: "Nomor_surat Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteNomorSurat);
module.exports = { router, deleteNomorSurat };
