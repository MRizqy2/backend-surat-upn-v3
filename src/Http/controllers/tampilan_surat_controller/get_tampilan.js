const express = require("express");
const router = express.Router();
const { Tampilan, Daftar_surat, Users, Jabatan } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { Sequelize } = require("sequelize");

const { Op } = require("sequelize");

// ...

const getTampilan = async (req, res) => {
  try {
    const { tampilan_id, jabatan_id, surat_id } = req.query;
    let tampilan;
    console.log("nyon[p", tampilan_id); //undefined bisa

    const whereClause = {};

    if (tampilan_id) {
      whereClause.id = tampilan_id;
    }

    if (jabatan_id) {
      whereClause.jabatan_id = jabatan_id;
    }

    if (surat_id) {
      whereClause.surat_id = surat_id;
    }

    console.log("omvweop", whereClause);
    tampilan = await Tampilan.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    if (req.query.from) {
      return tampilan;
    } else {
      res.status(StatusCodes.OK).json(tampilan);
    }
  } catch (error) {
    console.error("Error getting tampilan:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// ...

router.get("/", getTampilan);

module.exports = {
  getTampilan,
  router,
};
