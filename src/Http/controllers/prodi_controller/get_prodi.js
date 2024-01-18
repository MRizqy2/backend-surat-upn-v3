const express = require("express");
const { Prodi } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const router = express.Router();

const getProdi = async (req, res) => {
  res.send(
    await Prodi.findAll({
      where: {
        id: {
          [Op.ne]: 1, // Menghindari data dengan id 1
        },
      },
      order: [["id", "ASC"]],
    })
  );
};

router.get("/", getProdi);

module.exports = {
  getProdi,
  router,
};
