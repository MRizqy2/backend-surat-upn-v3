const express = require("express");
const { Periode } = require("../../../models");
const router = express.Router();

const getPeriode = async (req, res) => {
  res.send(await Periode.findAll({ order: [["id", "ASC"]] }));
};

router.get("/", getPeriode);

module.exports = {
  getPeriode,
  router,
};
