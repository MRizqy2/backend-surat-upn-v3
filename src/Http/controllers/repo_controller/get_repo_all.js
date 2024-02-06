const express = require("express");
const router = express.Router();

const { REPO } = require("../../../models");

const getRepo = async (req, res) => {
  const { folder_id } = req.query;

  const whereClause = {};
  if (req.query && folder_id !== undefined) {
    whereClause.folder_id = folder_id;
  }

  const repo = await REPO.findAll({
    where: whereClause,
    order: [["id", "ASC"]],
  });

  return res.json({ repo });
};
router.get("/", getRepo);

module.exports = { getRepo, router };
