const express = require("express");
const {
  Nomor_surat,
  Periode,
  Daftar_surat,
  Users,
  Jenis,
} = require("../../../models");
const router = express.Router();

const getNomorSurat = async function (req, res) {
  try {
    let nomor_surat;
    const { nomor_surat_id } = req.query;
    if (!nomor_surat_id) {
      nomor_surat = await Nomor_surat.findAll({
        attributes: ["id", "nomor_surat"],
        include: [
          {
            model: Daftar_surat,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: Jenis,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: Users,
                as: "user",
                attributes: ["id", "email", "name"],
              },
            ],
          },
          {
            model: Periode,
            as: "periode",
            attributes: ["id", "tahun", "status"],
          },
        ],

        order: [["id", "ASC"]],
      });
    } else if (nomor_surat_id) {
      nomor_surat = await Nomor_surat.findOne({
        attributes: ["nomor_surat"],
        include: [
          {
            model: Daftar_surat,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: Jenis,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: Users,
                as: "user",
                attributes: ["id", "email", "name"],
              },
            ],
          },
          {
            model: Periode,
            as: "periode",
            attributes: ["id", "tahun", "status"],
          },
        ],

        order: [["id", "ASC"]],
      });
    }
    res.json(nomor_surat);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: error.message });
  }
};

router.get("/", getNomorSurat);

module.exports = {
  getNomorSurat,
  router,
};
