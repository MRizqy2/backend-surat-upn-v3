const express = require("express");
const { Komentar, Users, Jabatan, Daftar_surat } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDetail = async function (req, res) {
  try {
    const komen = await Komentar.findOne({
      where: { surat_id: req.query.surat_id },
      // attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Jabatan,
          as: "jabatan_ke",
          attributes: ["name"],
        },
        {
          model: Jabatan,
          as: "jabatan_dari",
          attributes: ["name"],
        },
      ],
    });
    if (komen) {
      //salah model?
      res.status(StatusCodes.OK).json({
        komentar: komen,
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
