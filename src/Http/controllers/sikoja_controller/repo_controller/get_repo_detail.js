const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const {
  REPO,
  DAFTAR_SURAT,
  NOMOR_SURAT,
  STATUS,
  JENIS_SURAT,
  PERIODE,
  USERS,
  KOMENTAR,
  JABATAN,
  PRODI,
  FAKULTAS,
  PERBAIKAN,
  INDIKATOR,
  STRATEGI,
  IKU,
} = require("../../../../models");

const getRepoDetail = async (req, res) => {
  try {
    const { repo_id } = req.query;

    const whereClause = {};
    if (req.query && repo_id) {
      whereClause.id = repo_id;
    }
    const repo = await REPO.findOne({
      where: whereClause,
      order: [["id", "ASC"]],
      attributes: { exclude: ["indikator_id", "surat_id"] },
      include: [
        {
          model: INDIKATOR,
          as: "indikator",
          attributes: {
            exclude: ["iku_id", "strategi_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: STRATEGI,
              as: "strategi",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: IKU,
              as: "iku",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: DAFTAR_SURAT,
          as: "surat",
          attributes: { exclude: [, "createdAt", "updatedAt"] },
          order: [["id", "ASC"]],
          // where: {
          //   // "$surat.status.status$": status,
          //   ...whereClause,
          // },
          include: [
            {
              model: STATUS,
              as: "status",
              attributes: ["status", "persetujuan"],
            },
            // {
            //   model: TAMPILAN,
            //   as: "tampilan",
            //   attributes: ["pin", "dibaca"],
            //   // where: { jabatan_id: jabatan.id },
            // },
            {
              model: JENIS_SURAT,
              as: "jenis",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            // {
            //   model: AKSES_SURAT,
            //   as: "akses_surat",
            //   attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            //   // where: { jabatan_id: user.jabatan_id },
            // },
            {
              model: KOMENTAR,
              as: "komentar",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            },
            {
              model: PERBAIKAN,
              as: "perbaikan",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            },
            {
              model: NOMOR_SURAT,
              as: "nomor_surat",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
              include: [
                {
                  model: PERIODE,
                  as: "periode",
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                },
              ],
            },
            {
              model: USERS,
              as: "user",
              attributes: ["email", "name"],
              include: [
                {
                  model: PRODI,
                  as: "prodi",
                  attributes: ["id", "name"],
                  // where: { id: prodi.id },
                },
                {
                  model: JABATAN,
                  as: "jabatan",
                  attributes: ["id", "name"],
                  // where: { id: jabatan.id },
                },
                {
                  model: FAKULTAS,
                  as: "fakultas",
                  attributes: ["id", "name"],
                  // where: { id: fakultas.id },
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(StatusCodes.OK).json(repo);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.get("/", getRepoDetail);

module.exports = { getRepoDetail, router };
