const express = require("express");
// const app = express.Router();
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
const { Op } = require("sequelize");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  let surat;
  const { startDate, endDate } = req.query;

  let dateFilter = {};
  if (startDate) {
    const start = new Date(startDate);
    dateFilter[Op.gte] = start;
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setMilliseconds(end.getMilliseconds() - 1);
    dateFilter[Op.lte] = end;
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

  // const whereClause = {};
  const whereClause =
    startDate && endDate
      ? {
          tanggal: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        }
      : {};

  if (req.query && startDate !== undefined) {
    const start = new Date(startDate);
    let end;
    if (endDate) {
      end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      end.setMilliseconds(end.getMilliseconds() - 1);
    }
  }

  if (!fakultas.id || fakultas.name == `-` || fakultas.id == 1) {
    surat = await Daftar_surat.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        ...whereClause,
      },
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
              model: Prodi,
              as: "prodi",
              attributes: ["id", "name"],
              // where: { id: prodi.id },
            },
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
    surat = await Daftar_surat.findAll({
      //by fakultas
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        ...whereClause,
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
    surat = await Daftar_surat.findAll({
      //by prodi
      attributes: { exclude: [, "createdAt", "updatedAt"] },
      where: {
        "$user.prodi.id$": prodi.id,
        ...whereClause,
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
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
