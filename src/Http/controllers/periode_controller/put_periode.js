const express = require("express");
const { Periode } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const isAdmin = require("./../../middleware/adminMiddleware");

const putPeriode = async (req, res) => {
  try {
    const { tahun, status } = req.body;
    const { id } = req.query;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const data_periode = await Periode.findOne({ where: { id: id } });

    if (!data_periode) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Periode not found" });
    }

    const periode = await Periode.update(
      {
        tahun,
        status,
      },
      {
        where: { id: id }, // Gantilah dengan kriteria yang sesuai
        returning: true, // Menambahkan opsi returning
      }
    );

    res.json({
      updated: periode,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putPeriode, isAdmin);

module.exports = {
  putPeriode,
  router,
};
