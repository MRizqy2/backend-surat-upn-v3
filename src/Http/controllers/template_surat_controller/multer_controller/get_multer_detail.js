const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../../models");
const router = express.Router();

const getDetail = async (req, res) => {
  try {
    const { template_id } = req.query;
    const template_surat = await Template_surat.findOne({
      where: { id: template_id },
      include: [
        {
          model: Jenis_surat,
          as: "jenis",
          attributes: ["id", "jenis"],
        },
      ],
    });

    res.json(template_surat);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getDetail);

module.exports = {
  getDetail,
  router,
};
