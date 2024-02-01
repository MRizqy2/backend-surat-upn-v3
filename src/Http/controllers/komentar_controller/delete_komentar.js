const express = require("express");
const { KOMENTAR } = require("../../../models");
const router = express.Router();

const deleteKomentar = async (req, res) => {
  try {
    const { komentar_id, surat_id } = req.query;

    const whereClause = {};
    if (req.query && komentar_id !== undefined) {
      whereClause.id = komentar_id;
    }
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
    }

    const komentar = await KOMENTAR.findOne({
      where: whereClause,
    });
    if (!komentar) {
      if (!req.query.from) {
        res.status(404).json({ error: "Komentar not found" });
      } else {
        return komentar;
      }
    }

    const hapusKomentar = await KOMENTAR.destroy({
      where: whereClause,
    });

    if (hapusKomentar) {
      if (!req.query.from) {
        res
          .status(200)
          .json({ message: "Komentar surat deleted successfully" });
      } else {
        return hapusKomentar;
      }
    } else {
      res.status(404).json({ error: "Komentar Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteKomentar);
module.exports = { router, deleteKomentar };
