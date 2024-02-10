const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const {
  REPO,
  DAFTAR_SURAT,
  STATUS,
  USERS,
  KOMENTAR,
  NOMOR_SURAT,
  PERIODE,
  TAMPILAN,
  JENIS_SURAT,
  JABATAN,
  // AKSES_SURAT,
  PRODI,
  FAKULTAS,
} = require("../../../../models");
const catchStatus = require("../../status_surat_controller/catch_status");

const getRepo = async (req, res) => {
  try {
    const { surat_id } = req.query;

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const whereClause = {};
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
    }

    const reqStatus = {
      body: {
        isSigned: true,
      },
    };
    // const status = await catchStatus(reqStatus);

    const repo = await REPO.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
      include: [
        {
          model: DAFTAR_SURAT,
          as: "surat",
          attributes: { exclude: [, "createdAt", "updatedAt"] },
          order: [["id", "ASC"]],
          where: {
            // "$surat.status.status$": status,
            ...whereClause,
          },
          include: [
            {
              model: STATUS,
              as: "status",
              attributes: ["status", "persetujuan"],
            },
            {
              model: TAMPILAN,
              as: "tampilan",
              attributes: ["pin", "dibaca"],
              where: { jabatan_id: jabatan.id },
            },
            {
              model: JENIS_SURAT,
              as: "jenis",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            // {
            //   model: AKSES_SURAT,
            //   as: "akses_surat",
            //   attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            //   where: { jabatan_id: user.jabatan_id },
            // },
            {
              model: KOMENTAR,
              as: "komentar",
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

    return res.status(StatusCodes.OK).json({ repo });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
router.get("/", getRepo);

module.exports = { getRepo, router };
