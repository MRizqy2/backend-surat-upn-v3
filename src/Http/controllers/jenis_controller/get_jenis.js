const express = require("express");
const { Jenis } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(await Jenis.findAll({ order: [["id", "ASC"]] }));
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};
