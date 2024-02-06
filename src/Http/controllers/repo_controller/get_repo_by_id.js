const express = require("express");
const router = express.Router();

const { REPO } = require("../../../models");

const getRepoById = async (req, res) => {
  try {
    const { repo_id } = req.params;
    const repo = await REPO.findOne({ where: { id: repo_id } });
    return res.json({ repo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

router.get("/:id", getRepoById);

module.exports = { getRepoById, router };
