const express = require("express");
const { Users, Role_user, Fakultas, Prodi } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const app = express.Router();
const router = express.Router();

const getUser =
  (isAdmin,
  async (req, res) => {
    try {
      const users = await Users.findAll({
        include: [
          {
            model: Prodi,
            as: "prodi",
            attributes: {
              exclude: ["kode_prodi", "fakultas_id", "createdAt", "updatedAt"],
            },
          },
          {
            model: Role_user,
            as: "role",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Fakultas,
            as: "fakultas",
            attributes: {
              exclude: ["jenjang", "kode_fakultas", "createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: [
            "password",
            "role_id",
            "prodi_id",
            "fakultas_id",
            "createdAt",
            "updatedAt",
          ],
        },
        order: [["id", "ASC"]],
      });
      res.json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: error.message });
    }
  });

router.get("/update", getUser, isAdmin);

module.exports = {
  router,
  getUser,
  app,
};
