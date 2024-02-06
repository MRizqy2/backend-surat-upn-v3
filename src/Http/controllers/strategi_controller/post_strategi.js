const express = require("express");
const router = express.Router();
const { STRATEGI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const postStrategi = async (req, res) => {
  try {
    const { name } = req.body;

    const strategi = await STRATEGI.create({
      name,
    });

    res.status(StatusCodes.CREATED).json(strategi);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", postStrategi);

module.exports = { postStrategi, router };
