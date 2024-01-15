const express = require("express");
const { Jenis_surat } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(await Jenis_surat.findAll({ order: [["id", "ASC"]] }));
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};
