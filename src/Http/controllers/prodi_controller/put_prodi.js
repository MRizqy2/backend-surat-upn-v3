const express = require("express");
const { Prodi, Fakultas } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putProdi = async (req, res) => {
  try {
    const { name, kode_prodi, fakultas_id } = req.body;
    const { prodi_id } = req.query;
    if (!prodi_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const prodi = await Prodi.findOne({ where: { id: prodi_id } });

    if (!prodi) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Prodi not found" });
    }

    prodi.name = name;
    prodi.kode_prodi = kode_prodi;
    prodi.fakultas_id = fakultas_id;

    await prodi.save();

    res.status(StatusCodes.OK).json({
      message: "success update",
      updated: prodi.name,
      kode_prodi,
      fakultas_id,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putProdi);

module.exports = {
  putProdi,
  router,
};
