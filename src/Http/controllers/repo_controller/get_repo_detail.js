const express = require("express");
const router = express.Router();

const { REPO } = require("../../../models");

const getRepoDetail = async (req, res) => {
  try {
    const { repo_id } = req.query;

    const whereClause = {};
    if (req.query && repo_id !== undefined) {
      whereClause.id = repo_id;
    }
    const repos = await REPO.findOne({
      where: whereClause,
      attributes: {
        exclude: ["data_user"],
      },
    });

    const users = await REPO.findAll({
      where: whereClause,
      attributes: ["data_user"],
    });

    const parsedUsers = users.map((user) => {
      try {
        return user.data_user;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null; // or handle the error in a different way
      }
    });

    const response = {
      repo: repos,
      user: parsedUsers,
    };

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

router.get("/", getRepoDetail);

module.exports = { getRepoDetail, router };
