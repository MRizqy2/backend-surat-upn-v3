const express = require("express");
const { Akses_master, Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postAksesMaster = async (req, res) => {
  const {
    permision_id,
    prodi,
    template,
    periode,
    fakultas,
    jabatan,
    jenis_surat,
  } = req.body;
  try {
    //   const latestAksesMaster = await Akses_master.findAll({
    //     limit: 1,
    //     order: [["id", "DESC"]],
    //   });
    //   const permision = await Permision.findOne({
    //     where: { id: permision_id },
    //   });
    //   const latestAksesMasterId = parseInt(latestAksesMaster[0].id, 10);

    const akses_master = await Akses_master.create({
      // id: latestAksesMasterId + 1,
      permision_id,
      prodi,
      template,
      periode,
      fakultas,
      jabatan,
      jenis_surat,
    });
    if (req.body.from) {
      return akses_master;
    } else {
      res.status(StatusCodes.CREATED).json({
        message: `created Akses Master successfully`,
        akses_master,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postAksesMaster);

module.exports = {
  postAksesMaster,
  router,
};
