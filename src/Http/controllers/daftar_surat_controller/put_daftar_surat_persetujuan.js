const express = require("express");
const app = express.Router();
const router = express.Router();
const {
  Daftar_surat,
  Users,
  Jabatan,
  Prodi,
  Fakultas,
  Status,
  Tampilan,
} = require("../../../models");
const auth = require("../../middleware/authMiddleware");
const cloudinaryController = require("./cloudinary_controller/cloudinary_controller");
const { StatusCodes } = require("http-status-codes");
const getStatus = require("../status_surat_controller/status_controller");
const { Op, Sequelize } = require("sequelize");

const putPersetujuan = async (req, res) => {
  try {
    const { status, persetujuan } = req.body;
    const { id } = req.query;
    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });

    const surat = await Daftar_surat.findOne({
      where: { id: id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    const surat_per = await Daftar_surat.update(
      {
        persetujuan,
        status,
      },
      {
        where: { id: id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ surat: surat_per });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.get("/persetujuan", putPersetujuan);

module.exports = {
  router,
  putPersetujuan,
};
