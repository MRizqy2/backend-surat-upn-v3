const express = require("express");
const app = express.Router();
const router = express.Router();
const { STATUS } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const getStatus = async (req, res) => {
  try {
    const { status_id, surat_id } = req.query;
    const whereClause = {};
    let status;

    if (status_id) {
      whereClause.id = status_id;
    }
    if (surat_id) {
      whereClause.surat_id = surat_id;
    }
    status = await STATUS.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });
    console.log("mdwqpo", status[0]);

    if (req.query.from) {
      return status;
    } else {
      res.status(StatusCodes.OK).json(status);
    }
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

app.get("/", getStatus);

module.exports = { getStatus, app };
