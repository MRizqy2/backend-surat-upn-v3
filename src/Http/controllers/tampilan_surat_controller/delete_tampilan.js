const express = require("express");
const { Tampilan } = require("../../../models");
const router = express.Router();

const deleteTampilan = async (req, res) => {
  try {
    const { tampilan_id, surat_id, jabatan_id } = req.query;

    // if (!tampilan_id) {
    //   return res
    //     .status(400)
    //     .json({ error: "Parameter 'tampilan_id' is required" });
    // }

    const whereClause = {};
    if (req.query && tampilan_id !== undefined) {
      whereClause.id = tampilan_id;
    }
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
    }
    if (req.query && jabatan_id !== undefined) {
      whereClause.jabatan_id = jabatan_id;
    }

    const deletedTampilan = await Tampilan.destroy({
      where: whereClause,
    });

    if (deletedTampilan) {
      if (!req.query.from) {
        res.status(200).json({ message: "Tampilan deleted successfully" });
      } else {
        return deletedTampilan;
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

router.delete("/", deleteTampilan);

module.exports = {
  deleteTampilan,
  router,
};
