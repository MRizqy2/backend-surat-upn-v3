const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();
const { IKU } = require("../../../../models");

const postIku = async (req, res) => {
  try {
    const { name } = req.body;
    const iku = await IKU.create({
      name,
    });
    res.status(StatusCodes.CREATED).json(iku);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/", postIku);

module.exports = {
  postIku,
  router,
};
