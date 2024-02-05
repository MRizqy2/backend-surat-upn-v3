const express = require("express");
const router = express.Router();

const { FOLDER } = require("../../../models");

const getFolder = async (req, res) => {
  const folder = await FOLDER.findAll();
  return res.json({ folder });
};

router.get("/", getFolder);

module.exports = { getFolder, router };
