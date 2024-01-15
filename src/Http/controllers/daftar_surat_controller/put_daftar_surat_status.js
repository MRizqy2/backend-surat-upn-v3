const express = require("express");
const app = express.Router();
const router = express.Router();
const {
  Daftar_surat,
  Users,
  Role_user,
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
  const role = await Role_user.findOne({
    where: { id: user.role_id }, //
  });

  if (persetujuan) {
    setStatus = getStatus(role.id, status, persetujuan);
  } else {
    setStatus = getStatus(role.id, status);
  }

  surat.status = setStatus;

  await surat.save();
};

router.get("/status", putStatus);

module.exports = {
  router,
  putStatus,
};
