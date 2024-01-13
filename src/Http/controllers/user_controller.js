const express = require("express");
const { Users, Role_user, Fakultas, Prodi } = require("../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("../middleware/adminMiddleware");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express.Router();

app.get("/", isAdmin, async (req, res) => {
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

// app.get("/", async (req, res) => {
//   try {
//     const user = await Users.findByPk(req.query.id);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.put("/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await Users.findOne({ where: { id: req.token.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password does not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updated] = await Users.update(
      { password: hashedPassword },
      {
        where: { id: req.token.id },
      }
    );

    if (updated) {
      res.json({ message: `${user.email} Password updated successfully` });
    } else {
      res.status(500).json({ error: "Failed to update password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/", isAdmin, async (req, res) => {
  try {
    if (req.query.id == 1) {
      return res.status(Stat);
    }
    const deleted = await Users.destroy({
      where: { id: req.query.id },
    });
    if (deleted) {
      res.status(200).json("User deleted");
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
