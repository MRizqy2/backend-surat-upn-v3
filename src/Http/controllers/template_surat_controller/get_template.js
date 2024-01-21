const express = require("express");
const { Template_surat, Jenis_surat } = require("../../../models/index.js");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;
    let template;

    if (!template_id) {
      template = await Template_surat.findAll({
        include: [
          {
            model: Jenis_surat,
            as: "jenis",
            attributes: ["id", "jenis"],
          },
        ],
        order: [["id", "ASC"]],
      });
    } else {
      template = await Template_surat.findOne({
        where: { id: template_id },
        include: [
          {
            model: Jenis_surat,
            as: "jenis",
            attributes: ["id", "jenis"],
          },
        ],
        order: [["id", "ASC"]],
      });
    }

    if (!req.body.from) {
      res.status(StatusCodes.OK).json(template);
    } else {
      return template;
    }
  } catch (error) {
    console.error("Error getting templates:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message || "An internal server error occurred.",
    });
  }
};

router.get("/", getTemplate);

module.exports = {
  getTemplate,
  router,
};
