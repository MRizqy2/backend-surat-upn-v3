const express = require("express");
const { Jenis, Users, Role_user, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postJenis = async function (req, res) {
  try {
    const { jenis } = req.body;

    const jenis_surat = await Jenis.create({
      jenis,
      role_id: role_user.id,
      komentar,
    });

    return res.json({ message: "Berhasil", jenis_surat });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", postJenis);

module.exports = {
  postJenis,
  router,
};
