const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const {
  Users,
  Role_user,
  Prodi,
  Fakultas,
} = require("../../../models/index.js");
const config = require("../../../../config/config.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const isAdmin = require("../../middleware/adminMiddleware.js");
const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
// const { router } = require("../daftar_surat_controller/cloudinary_controller.js");
const app = express.Router();
const router = express.Router();

const environment = "development";
const secretKey = config[environment].secret_key;

const postLogin = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email.toLowerCase() },
    });
    if (user && !user.aktif) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User is not active" });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ id: user.id, aktif: user.aktif }, secretKey, {
        expiresIn: "1d",
      });
      const user_response = await Users.findOne({
        include: [
          {
            model: Prodi,
            as: "prodi",
            attributes: ["id", "name"],
          },
          {
            model: Role_user,
            as: "role",
            attributes: ["id", "name"],
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
      res.json({
        message: "Login Berhasil",
        token,
        user_response,
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
