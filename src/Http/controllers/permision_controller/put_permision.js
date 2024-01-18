const express = require("express");
const { Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const putPermision =
  (isAdmin,
  async (req, res) => {
    try {
      const {
        jabatan_id,
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
      } = req.body;
      const { permision_id } = req.query;
      if (!permision_id) {
        return res.status(400).json({ error: "Invalid params" });
      }

      const permision = await Permision.findOne({
        where: { id: permision_id },
      });

      if (!permision) {
        return res.status(404).json({ error: "Permision not found" });
      }
      const permision_update = await Permision.update(
        {
          jabatan_id,
          buat_surat,
          download_surat,
          generate_nomor_surat,
          upload_tandatangan,
          persetujuan,
        },
        {
          where: { id: permision_id },
          returning: true,
        }
      );

      res.status(StatusCodes.OK).json({ permision: permision_update });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.put("/", isAdmin, putPermision, isAdmin);

module.exports = {
  putPermision,
  router,
};
