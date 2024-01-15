const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const {
  Users,
  Role_user,
  Prodi,
  Fakultas,
} = require("../../../models/index.js");
const config = require("../../../../config/config.js");
const crypto = require("crypto");
const isAdmin = require("../../middleware/adminMiddleware.js");
const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

const postRegister =
  (authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { name, email, role_id, prodi_id, fakultas_id } = req.body;

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "User with this email already exists" });
      }
      // add user by index
      const latestUser = await Users.findAll({
        limit: 1,
        order: [["id", "DESC"]],
      });
      const latestUserId = parseInt(latestUser[0].id, 10);

      // Generate a random password
      const password = crypto.randomBytes(10).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);

      const role_user = await Role_user.findOne({
        where: { id: role_id },
      });
      if (!role_user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "No such role_user exists" });
      }

      const prodi_user = await Prodi.findOne({
        where: { id: prodi_id },
      });
      if (!prodi_user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "No such prodi_user exists" });
      }

      const fakultas_user = await Fakultas.findOne({
        where: { id: fakultas_id },
      });
      if (!fakultas_user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "No such fakultas_user exists" });
      }

      if (role_id != 2) {
        if (prodi_id != 1) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Not Prodi, Change Prodi to 1" });
        }
      }
      if (role_id == 2) {
        if (prodi_id == 1) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Prodi have to had prodi, Select other than 1" });
        }
      }

      const user = await Users.create({
        id: latestUserId + 1,
        name,
        email,
        password: hashedPassword,
        role_id: role_user.id,
        prodi_id: prodi_user.id,
        fakultas_id: fakultas_user.id,
        aktif: true,
      });
      // const token = jwt.sign({ id: user.id, aktif: user.aktif }, secretKey, {
      //   expiresIn: "24h",
      // });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "User created successfully", password });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  });

router.post("/register", authMiddleware, isAdmin, postRegister);
module.exports = {
  router,
  postRegister,
};