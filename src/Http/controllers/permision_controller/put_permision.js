const express = require("express");
const { Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putPermision = async (req, res) => {
  try {
    const {
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
    } = req.body;
    const { jabatan_id } = req.query;
    if (!jabatan_id) {
      return res.status(400).json({ error: "Invalid params" });
    }

    const permision = await Permision.findOne({
      where: { jabatan_id: jabatan_id },
    });

    if (!permision) {
      return res.status(404).json({ error: "Permision not found" });
    }
    const permision_update = await Permision.update(
      {
        // jabatan_id,
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
      },
      {
        where: { jabatan_id: permision.jabatan_id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ permision: permision_update });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putPermision);

module.exports = {
  putPermision,
  router,
};
