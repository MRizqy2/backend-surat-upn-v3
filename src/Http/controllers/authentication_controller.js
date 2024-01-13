const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { Users, Role_user, Prodi, Fakultas } = require("../../models");
const config = require("../../../config/config.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const isAdmin = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware.js");
const express = require("express");
const app = express.Router();

const environment = "development";
const secretKey = config[environment].secret_key;

app
  .post("/register", authMiddleware, isAdmin, async (req, res) => {
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
  })

  .post("/login", async (req, res) => {
    try {
      const user = await Users.findOne({
        where: { email: req.body.email },
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
  })

  .put("/reset-password", authMiddleware, isAdmin, async (req, res) => {
    try {
      const { user_id } = req.query;
      if (user_id == 1) {
        res.json("Error : The User is Admin");
      }
      const password = crypto.randomBytes(10).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);
      const updated = await Users.update(
        { password: hashedPassword },
        {
          where: { id: user_id },
        }
      );
      const search_user = await Users.findOne({
        where: { id: user_id },
        attributes: ["id", "name", "password"],
      });
      let user = search_user;
      user.password = password;

      if (updated) {
        res.json({ message: "Password reset successfully", user });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  })

  .put("/aktivasi", authMiddleware, isAdmin, async (req, res) => {
    try {
      const { aktif } = req.body;
      const { user_id } = req.query;
      if (user_id == 1) {
        return res.json("Error : The User is Admin");
      }
      const [updated] = await Users.update(
        { aktif },
        {
          where: { id: user_id },
        }
      );
      let message;
      if (updated) {
        if (aktif === true) {
          message = "User activated successfully";
        } else {
          message = "User deactivated successfully"; // bug message
        }
        res.json({ message });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  });

module.exports = app;
