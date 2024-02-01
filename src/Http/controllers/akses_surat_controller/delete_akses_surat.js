const express = require("express");
const { AKSES_SURAT } = require("../../../models");
const router = express.Router();

const deleteAksesSurat = async (req, res) => {
  try {
    const { akses_surat_id, surat_id, jabatan_id } = req.query;

    const whereClause = {};

    if (req.query && akses_surat_id !== undefined) {
      whereClause.id = akses_surat_id;
    }
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
    }
    if (req.query && jabatan_id !== undefined) {
      whereClause.jabatan_id = jabatan_id;
    }

    const deletedAksesSurat = await AKSES_SURAT.destroy({
      where: whereClause,
    });

    if (deletedAksesSurat) {
      if (!req.query.from) {
        res.status(200).json({ message: "Akses Surat deleted successfully" });
      } else {
        return deletedAksesSurat;
      }
    } else {
      if (res) {
        res.status(404).json({ error: "Akses Surat not found" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteAksesSurat);

module.exports = {
  deleteAksesSurat,
  router,
};
