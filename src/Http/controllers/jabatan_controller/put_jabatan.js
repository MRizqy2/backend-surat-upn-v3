const express = require("express");
const { Jabatan } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const putJabatan =
  (isAdmin,
  async (req, res) => {
    try {
      const { name, jabatan_atas_id, jabatan_bawah_id } = req.body;
      const { jabatan_id } = req.query;
      if (!jabatan_id) {
        return res.status(400).json({ error: "Invalid params" });
      }

      const jabatan = await Jabatan.findOne({ where: { id: jabatan_id } });

      if (!jabatan) {
        return res.status(404).json({ error: "Jabatan not found" });
      }
      const jabatan_update = await Jabatan.update(
        {
          name,
          jabatan_atas_id: jabatan_atas_id || null,
          jabatan_bawah_id: jabatan_bawah_id || null,
        },
        {
          where: { id: jabatan_id },
          returning: true,
        }
      );

      res.json({ updatedName: jabatan_update[1][0].name + " success update" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.put("/", putJabatan, isAdmin);

module.exports = {
  putJabatan,
  router,
};
