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
} = require("../../../../models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  const { surat_id } = req.query;
  let surat;
  const user = await USERS.findOne({
    where: { id: req.token.id },
  });
  const jabatan = await JABATAN.findOne({
    where: { id: user.jabatan_id },
  });
  const prodi = await PRODI.findOne({
    where: { id: user.prodi_id },
  });
  const fakultas = await FAKULTAS.findOne({
    where: { id: user.fakultas_id },
  });

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
            // where: { id: prodi.id },
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

  res.json(surat);
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
