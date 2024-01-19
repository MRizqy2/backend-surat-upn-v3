const express = require("express");
const { Akses_master, Permision, Jabatan, Users } = require("../../../models");
const { where } = require("sequelize");
const jabatan = require("../../../models/jabatan");
const router = express.Router();

const getJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      // Mendapatkan semua data
      const allData = await Jabatan.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Permision,
            as: "permision",
            attributes: { exclude: ["jabatan_id", "createdAt", "updatedAt"] },
            include: [
              {
                model: Akses_master,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: Jabatan,
            as: "jabatan_atas",
            attributes: {
              exclude: ["jabatan_id", "createdAt", "updatedAt"],
            },
          },
        ],
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (jabatan_id) {
      // Mendapatkan data berdasarkan ID
      const findOneData = await Jabatan.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          // {
          //   exclude: ["createdAt", "updatedAt"],
          // },
          {
            model: Permision,
            as: "permision",
            attributes: {
              exclude: [
                "jabatan_id",
                // "jabatan_atas_id",
                "createdAt",
                "updatedAt",
              ],
            },

            include: [
              {
                model: Akses_master,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: Jabatan,
            as: "jabatan_atas",
            attributes: {
              exclude: ["jabatan_id", "createdAt", "updatedAt"],
            },
          },
        ],
        order: [["id", "ASC"]],
        where: { id: jabatan_id },
      });
      if (req.query.from) {
        return findOneData;
      } else {
        if (findOneData) {
          res.send(findOneData);
        } else {
          res.status(404).json({ error: "Data not found" });
        }
      }
    } else {
      res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.get("/", getJabatan);
module.exports = {
  getJabatan,
  router,
};
