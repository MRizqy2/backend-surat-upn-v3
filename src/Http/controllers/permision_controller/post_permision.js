const express = require("express");
const { Akses_master, Permision } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const postPermision =
  (isAdmin,
  async (req, res) => {
    const {
      jabatan_id,
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
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

      const permision = await Permision.create({
        // id: latestAksesMasterId + 1,
        jabatan_id,
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
      });
      res.status(StatusCodes.CREATED).json({
        message: `${permision} created permision successfully`,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });

router.post("/", postPermision, isAdmin);

module.exports = {
  postPermision,
  router,
};
