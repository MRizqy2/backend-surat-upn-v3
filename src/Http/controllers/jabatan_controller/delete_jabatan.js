const express = require("express");
const { Jabatan, Akses_master, Permision } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const deleteJabatan =
  (isAdmin,
  async (req, res) => {
    try {
      const { jabatan_id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Parameter 'id' is required" });
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
  });

router.delete("/", deleteJabatan, isAdmin);

module.exports = {
  deleteJabatan,
  router,
};
