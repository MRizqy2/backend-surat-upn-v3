const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { Users, Jabatan, Prodi, Fakultas } = require("../../../models/index.js");

const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

const postRegister =
  (authMiddleware,
  async (req, res) => {
    try {
      const { name, email, jabatan_id, prodi_id, fakultas_id } = req.body;

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

      const password = "12345";
      const hashedPassword = await bcrypt.hash(password, 10);

      const jabatan_user = await Jabatan.findOne({
        where: { id: jabatan_id },
      });
      if (!jabatan_user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "No such jabatan exists" });
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

      const user = await Users.create({
        id: latestUserId + 1,
        name,
        email,
        password: hashedPassword,
        jabatan_id: jabatan_user.id,
        prodi_id: prodi_user.id,
        fakultas_id: fakultas_user.id,
        aktif: true,
      });

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

router.post("/register", authMiddleware, postRegister);
module.exports = {
  router,
  postRegister,
};
