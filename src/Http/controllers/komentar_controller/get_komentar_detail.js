const express = require("express");
const { Komentar, Users, Role_user, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDetail = async function (req, res) {
  try {
    const komen = await Komentar.findOne({
      where: { surat_id: req.query.surat_id },
      include: [
        {
          model: Role_user,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
    if (komen) {
      res.status(StatusCodes.OK).json({
        komen: {
          komentar: komen.komentar,
        },
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        error: "Komentar not found",
      });
    }
  } catch (error) {}
};

router.get("/detail", getDetail);

module.exports = {
  getDetail,
  router,
};
