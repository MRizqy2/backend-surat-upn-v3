const express = require("express");
const { Komentar, Users, Role_user, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDetail = async function (req, res) {
  try {
    const komen = await Komentar.findOne({
      where: { id: req.query.id },
    });
  } catch (error) {}
};

router.get("/detail", getDetail);

module.exports = {
  getDetail,
  router,
};
