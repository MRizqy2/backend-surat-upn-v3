const express = require("express");
const { Akses_master, Permision, Jabatan, Users } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const { where } = require("sequelize");
const jabatan = require("../../../models/jabatan");
const router = express.Router();

const getJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      // Mendapatkan semua data
      const allData = await Jabatan.findAll({
        include: [
          {
            model: Permision,
            as: "permision",
            attributes: { exclude: ["jabatan_id", "createdAt", "UpdatedAt"] },
            include: [
              {
                model: Akses_master,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "UpdatedAt"],
                },
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (jabatan_id) {
      // Mendapatkan data berdasarkan ID
      const findOneData = await Jabatan.findOne({
        include: [
          {
            model: Permision,
            as: "permision",
            attributes: { exclude: ["jabatan_id", "createdAt", "UpdatedAt"] },
            include: [
              {
                model: Akses_master,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "UpdatedAt"],
                },
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
        where: { id: jabatan_id },
      });

      if (findOneData) {
        res.send(findOneData);
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.get("/", isAdmin, getJabatan);
module.exports = {
  getJabatan,
  router,
};
