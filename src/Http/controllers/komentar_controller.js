const express = require("express");
const { Komentar, Users, Role_user, Daftar_surat } = require("../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

app
  .get("/", async function (req, res) {
    res.send(await Komentar.findAll({ order: [["id", "ASC"]] }));
  })

  .get("/", async function (req, res) {
    try {
      const komen = await Komentar.findOne({
        where: { id: req.query.id },
      });
    } catch (error) {}
  })

  .post("/", async function (req, res) {
    try {
      const { komentar, surat_id } = req.body;

      const user = await Users.findOne({ where: { id: req.token.id } });
      // const surat = await Daftar_surat.findOne({ where: { id: surat_id } });
      const role_user = await Role_user.findOne({
        where: { id: user.role_id },
      });

      const komen = await Komentar.create({
        surat_id,
        role_id: role_user.id,
        komentar,
      });
      // await Daftar_surat.update(
      //   {
      //     komentar_id: komen.id,
      //   },
      //   {
      //     where: { id: surat_id },
      //   }
      // );

      // // Fetch Daftar_surat with included Komentar
      // const updatedSurat = await Daftar_surat.findOne({
      //   where: { id: surat_id },
      //   include: [{ model: Komentar, as: "komentar" }],
      //   attributes: {
      //     exclude: ["komentar_id"],
      //   },
      // });

      return res.json({ message: "Berhasil", komen });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = app;
