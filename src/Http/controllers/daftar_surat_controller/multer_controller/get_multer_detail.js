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
  Jenis_surat,
  Komentar,
  Nomor_surat,
  Periode,
} = require("../../../../models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  const { surat_id } = req.query;
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

  surat = await Daftar_surat.findOne({
    where: { id: surat_id },
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
            model: Prodi,
            as: "prodi",
            attributes: ["id", "name"],
            where: { id: prodi.id },
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

  res.json(surat);
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};
