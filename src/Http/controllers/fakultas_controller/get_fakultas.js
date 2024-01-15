const express = require("express");
const { Fakultas } = require("../../../models");
const { Op } = require("sequelize");
const router = express.Router();

const getFakultas = async (req, res) => {
  res.send(
    await Fakultas.findAll({
      where: {
        id: {
          [Op.ne]: 1, // Menghindari data dengan id 1
        },
      },
    })
  );
};

router.get("/", getFakultas);

module.exports = {
  getFakultas,
  router,
};
