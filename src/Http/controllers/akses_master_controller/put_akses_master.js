const express = require("express");
const { Akses_master } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putAksesMaster = async (req, res) => {
  try {
    const {
      permision_id,
      prodi,
      template,
      periode,
      fakultas,
      jabatan,
      jenis_surat,
    } = req.body;
    const { akses_master_id } = req.query;
    if (!akses_master_id) {
      return res.status(400).json({ error: "Invalid params" });
    }

    const akses_master = await Akses_master.findOne({
      where: { id: akses_master_id },
    });

    if (!akses_master) {
      return res.status(404).json({ error: "akses master not found" });
    }
    const akses_master_update = await Akses_master.update(
      {
        permision_id,
        prodi,
        template,
        periode,
        fakultas,
        jabatan,
        jenis_surat,
      },
      {
        where: { id: akses_master_id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ Akses_master: akses_master_update });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putAksesMaster);

module.exports = {
  putAksesMaster,
  router,
};
