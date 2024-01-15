const express = require("express");
const { Jenis_surat } = require("../../../models");
const router = express.Router();

const postJenis = async function (req, res) {
  try {
    const { jenis } = req.body;
    const latestJenis = await Jenis_surat.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    const latestJenisId = parseInt(latestJenis[0].id, 10);
    const jenis_surat = await Jenis_surat.create({
      id: latestJenisId + 1,
      jenis,
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
