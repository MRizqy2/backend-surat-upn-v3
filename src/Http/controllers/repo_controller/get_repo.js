const express = require("express");
const router = express.Router();

const { REPO } = require("../../../models");

const getRepo = async (req, res) => {
  const repo = await REPO.findAll();
  return res.json({ repo });
};

router.get("/", getRepo);

module.exports = { getRepo, router };
