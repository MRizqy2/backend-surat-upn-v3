const express = require("express");
const {
  Akses_surat,
  Jabatan,
  Users,
  Daftar_surat,
  Jenis_surat,
} = require("../../../models");
const router = express.Router();

const getAksesSurat = async (req, res) => {
  try {
    const { akses_surat_id } = req.query;
    let aksesSurat;
    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    if (!akses_surat_id) {
      aksesSurat = await Akses_surat.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Daftar_surat,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: Jenis_surat,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: Users,
                as: "user",
                attributes: ["email", "name"],
              },
            ],
          },
          {
            model: Jabatan,
            as: "jabatan",
            attributes: ["id", "name"],
          },
        ],
      });
    } else if (akses_surat_id) {
      aksesSurat = await Akses_surat.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Daftar_surat,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: Jenis_surat,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: Users,
                as: "user",
                attributes: ["email", "name"],
              },
            ],
          },
          {
            model: Jabatan,
            as: "jabatan",
            attributes: ["id", "name"],
          },
        ],
      });
    }
    res.json(aksesSurat);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
router.get("/", getAksesSurat);

module.exports = {
  router,
  getAksesSurat,
};