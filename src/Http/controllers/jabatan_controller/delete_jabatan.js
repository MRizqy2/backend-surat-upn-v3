const express = require("express");
const { Jabatan, Akses_master, Permision } = require("../../../models");
const router = express.Router();

const deleteJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'jabatan_id' is required" });
    }

    const deletedJabatan = await Jabatan.destroy({
      where: { id: jabatan_id },
    });

    const permision = await Permision.findOne({
      where: { jabatan_id: jabatan_id },
    });
    const deletedPermision = await Permision.destroy({
      where: { jabatan_id: jabatan_id },
    });

    const deletedAksesMaster = await Akses_master.destroy({
      where: { permision_id: permision.id },
    });

    if (deletedJabatan) {
      res.status(200).json({ message: "Jabatan deleted successfully" });
    } else {
      res.status(404).json({ error: "Jabatan not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteJabatan);

module.exports = {
  deleteJabatan,
  router,
};
