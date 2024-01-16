const express = require("express");
const { Komentar, Users, Role_user, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDetail = async function (req, res) {
  try {
    const komen = await Komentar.findOne({
      where: { id: req.query.id },
    });
    if (komen) {
      res.status(StatusCodes.OK).json({
        komen: {
          role_id: komen.role_id,
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
