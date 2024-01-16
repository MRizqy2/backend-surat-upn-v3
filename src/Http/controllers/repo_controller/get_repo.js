const express = require("express");
const router = express.Router();

const { Repo } = require("../../../models");

const getRepo = async (req, res) => {
  const repo = await Repo.findAll();
  return res.json({ repo });
};

router.get("/", getRepo);

module.exports = { getRepo, router };
