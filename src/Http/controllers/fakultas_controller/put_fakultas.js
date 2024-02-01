const express = require("express");
const { FAKULTAS } = require("../../../models");
const router = express.Router();

const putFakultas = async (req, res) => {
  try {
    const { nama, jenjang, kode_fakultas } = req.body;
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Invalid params" });
    }

    const fakultas = await FAKULTAS.findOne({ where: { id: id } });

    if (!fakultas) {
      return res.status(404).json({ error: "Fakultas not found" });
    }

    fakultas.name = nama;
    fakultas.jenjang = jenjang;
    fakultas.kode_fakultas = kode_fakultas;

    await fakultas.save();

    res.json({
      updated: fakultas.name,
      jenjang,
      kode_fakultas,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putFakultas);

module.exports = {
  putFakultas,
  router,
};
