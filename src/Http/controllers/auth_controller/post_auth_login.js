const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { Users, Jabatan, Prodi, Fakultas } = require("../../../models/index.js");
const config = require("../../../../config/config.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
const { getJabatan } = require("../jabatan_controller/get_jabatan.js");
const router = express.Router();
const sequelize = require("sequelize");

const environment = "development";
const secretKey = config[environment].secret_key;

const postLogin = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          req.body.email.toLowerCase()
        ),
      },
    });

    if (user && !user.aktif) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User is not active" });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ id: user.id, aktif: user.aktif }, secretKey, {
        expiresIn: "7d",
      });
      const searchUser = await Users.findOne({
        where: { id: user.id },
      });

      const user_response = await Users.findOne({
        include: [
          {
            model: Prodi,
            as: "prodi",
            attributes: ["id", "name"],
          },
          {
            model: Jabatan,
            as: "jabatan",
            attributes: {
              exclude: ["jabatan_atas_id", "createdAt", "UpdatedAt"],
            },
            where: { id: searchUser.jabatan_id },
          },
          {
            model: Fakultas,
            as: "fakultas",
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id", "name", "email", "aktif"],
        where: { email: req.body.email },
      });

      const reqJabatan = {
        query: {
          jabatan_id: user.jabatan_id,
          from: `auth_controller/post_auth_login.js`,
        },
      };
      const saveJabatan = await getJabatan(reqJabatan);
      res.json({
        message: "Login Berhasil",
        token,
        user_response,
        jabatan: saveJabatan,
      });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid login credentials" });
    }
  } catch (error) {
    console.log("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/login", postLogin);
module.exports = {
  router,
  postLogin,
};
