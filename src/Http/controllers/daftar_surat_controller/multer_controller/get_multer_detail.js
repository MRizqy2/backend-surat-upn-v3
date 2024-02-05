const express = require("express");
const app = express.Router();
const router = express.Router();
const {
  DAFTAR_SURAT,
  USERS,
  JABATAN,
  PRODI,
  FAKULTAS,
  STATUS,
  JENIS_SURAT,
  KOMENTAR,
  NOMOR_SURAT,
  PERIODE,
  REVISI,
  TAMPILAN,
} = require("../../../../models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  const { surat_id } = req.query;

  const user = await USERS.findOne({
    where: { id: req.token.id },
  });

  let surat;

  surat = await DAFTAR_SURAT.findOne({
    where: { id: surat_id },
    attributes: { exclude: ["createdAt", "updatedAt"] },
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
        where: { jabatan_id: user.jabatan_id },
      },
      {
        model: JENIS_SURAT,
        as: "jenis",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: KOMENTAR,
        as: "komentar",
        attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
        required: false,
      },
      {
        model: NOMOR_SURAT,
        as: "nomor_surat",
        attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
        required: false,
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
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: ["id", "name"],
          },
          {
            model: FAKULTAS,
            as: "fakultas",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });
  const revisi = await REVISI.findAll({
    where: { surat_id_baru: surat_id },
    attributes: [],
    include: [
      {
        model: DAFTAR_SURAT,
        as: "surat_id_old",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: NOMOR_SURAT,
            as: "nomor_surat",
            attributes: {
              exclude: ["surat_id", "periode_id", "createdAt", "updatedAt"],
            },
            required: false,
            include: [
              {
                model: PERIODE,
                as: "periode",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });

  res.json({ surat, revisi });
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
