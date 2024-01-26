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
  Akses_surat,
  Jenis_surat,
  Komentar,
  Nomor_surat,
  Periode,
} = require("../../../models");
const auth = require("../../middleware/authMiddleware");
const cloudinaryController = require("./cloudinary_controller/cloudinary_controller");
const { StatusCodes } = require("http-status-codes");
const getStatus = require("../status_surat_controller/catch_status");
const { Op, Sequelize } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  let surat;

  const user = await Users.findOne({
    where: { id: req.token.id },
  });
  const jabatan = await Jabatan.findOne({
    where: { id: user.jabatan_id },
  });
  const prodi = await Prodi.findOne({
    where: { id: user.prodi_id },
  });
  const fakultas = await Fakultas.findOne({
    where: { id: user.fakultas_id },
  });

  if (!fakultas.id || fakultas.name == `-` || fakultas.id == 1) {
    console.log("ovorvpw");
    surat = await Daftar_surat.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Status,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        // {
        //   model: Tampilan,
        //   as: "tampilan",
        //   attributes: ["pin", "dibaca"],
        //   // where: { jabatan_id: jabatan.id },
        // },
        {
          model: Jenis_surat,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        // {
        //   model: Akses_surat,
        //   as: "akses_surat",
        //   attributes: { exclude: ["createdAt", "updatedAt"] },
        //   // where: { jabatan_id: user.jabatan_id },
        // },
        {
          model: Komentar,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: Nomor_surat,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
          include: [
            {
              model: Periode,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: Users,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: Prodi,
              as: "prodi",
              attributes: ["id", "name"],
              // where: { id: jabatan.id },
            },
            {
              model: Jabatan,
              as: "jabatan",
              attributes: ["id", "name"],
              // where: { id: jabatan.id },
            },
            {
              model: Fakultas,
              as: "fakultas",
              attributes: ["id", "name"],
              // where: { id: fakultas.id },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  } else if (!prodi.id || prodi.name == `-` || prodi.id == 1) {
    console.log("moomp");
    surat = await Daftar_surat.findAll({
      //by fakultas
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Status,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: Tampilan,
          as: "tampilan",
          attributes: ["pin", "dibaca"],
          where: { jabatan_id: jabatan.id },
        },
        {
          model: Jenis_surat,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Akses_surat,
          as: "akses_surat",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { jabatan_id: user.jabatan_id },
        },
        {
          model: Komentar,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: Nomor_surat,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          include: [
            {
              model: Periode,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: Users,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: Prodi,
              as: "prodi",
              attributes: ["id", "name"],
              // where: { id: prodi.id },
            },
            {
              model: Jabatan,
              as: "jabatan",
              attributes: ["id", "name"],
              // where: { id: jabatan.id },
            },
            {
              model: Fakultas,
              as: "fakultas",
              attributes: ["id", "name"],
              where: { id: fakultas.id },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  } else {
    console.log("mrprmv");
    surat = await Daftar_surat.findAll({
      //by prodi
      attributes: { exclude: ["user_id", "createdAt", "updatedAt"] },
      where: {
        "$user.prodi.id$": prodi.id,
      },
      include: [
        {
          model: Status,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: Tampilan,
          as: "tampilan",
          attributes: ["pin", "dibaca"],
          where: { jabatan_id: jabatan.id },
        },
        {
          model: Jenis_surat,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Akses_surat,
          as: "akses_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          where: { jabatan_id: user.jabatan_id },
        },
        {
          model: Komentar,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
        },
        {
          model: Nomor_surat,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          include: [
            {
              model: Periode,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: Users,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: Prodi,
              as: "prodi",
              attributes: ["id", "name"],
              where: { id: prodi.id },
            },
            {
              model: Jabatan,
              as: "jabatan",
              attributes: ["id", "name"],
              where: { id: jabatan.id },
            },
            {
              model: Fakultas,
              as: "fakultas",
              attributes: ["id", "name"],
              where: { id: fakultas.id },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }
  res.json(surat);
}; //

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
