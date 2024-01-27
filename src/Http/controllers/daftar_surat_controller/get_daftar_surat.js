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

  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);
  let dataFilter = {};

  if (month && year) {
    if (month < 1 || month > 12) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The 'month' parameter must be between 1 and 12" });
    }

    dataFilter[Op.and] = [
      Sequelize.literal(
        `"Daftar_surat"."createdAt" >= DATE_TRUNC('month', TIMESTAMP '${year}-${month}-01') - INTERVAL '1 month'`
      ),
      Sequelize.literal(
        `"Daftar_surat"."createdAt" < DATE_TRUNC('month', TIMESTAMP '${year}-${month}-01') + INTERVAL '2 months'`
      ),
    ];
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Both 'month' and 'year' parameters are required" });
  }
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
    surat = await Daftar_surat.findAll({
      where: dataFilter,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Status,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: Jenis_surat,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
              model: Jabatan,
              as: "jabatan",
              attributes: ["id", "name"],
            },
            {
              model: Fakultas,
              as: "fakultas",
              attributes: ["id", "name"],
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
      where: dataFilter,
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
              model: Jabatan,
              as: "jabatan",
              attributes: ["id", "name"],
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
        dataFilter,
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
