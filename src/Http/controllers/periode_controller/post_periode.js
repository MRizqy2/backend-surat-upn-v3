const express = require("express");
const { Periode } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postPeriode = async (req, res) => {
  const { tahun } = req.body;
  try {
    const activePeriodes = await Periode.findAll({ where: { status: true } });

    if (activePeriodes.length > 0) {
      // Mendapatkan id dari semua periode yang memiliki status true
      const activePeriodeIds = activePeriodes.map((periode) => periode.id);

      await Periode.update(
        { status: false },
        { where: { id: activePeriodeIds } }
      );
    }

    const periode = await Periode.create({
      tahun,
      status: true,
    });
    res.status(StatusCodes.CREATED).json({
      message: `created successfully`,
      periode,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postPeriode);

module.exports = {
  postPeriode,
  router,
};
