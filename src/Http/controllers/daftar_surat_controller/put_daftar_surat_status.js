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

const putStatus = async (req, res) => {
  const { id } = req.query;
  const { status, persetujuan } = req.body;
  let setStatus;
  const surat = Daftar_surat.findOne({
    where: { id },
  });

  const user = await Users.findOne({
    where: { id: req.token.id },
  });
  const jabatan = await Jabatan.findOne({
    where: { id: user.jabatan_id }, //
  });

  if (persetujuan) {
    setStatus = getStatus(jabatan.id, status, persetujuan);
  } else {
    setStatus = getStatus(jabatan.id, status);
  }

  surat.status = setStatus;

  await surat.save();
};

router.get("/status", putStatus);

module.exports = {
  router,
  putStatus,
};
