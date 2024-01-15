const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const {
  Daftar_surat,
  Template_surat,
  Role_user,
  Users,
  Jenis_surat,
} = require("../../../../models");
// const getStatus = require("./status_controller");
const {
  postStatus,
} = require("../../status_surat_controller/status_surat_controller");
const {
  postTampilan,
} = require("../../tampilan_surat_controller/tampilan_surat_controller");
// const status = getStatus();

const fs = require("fs");
const fetch = require("node-fetch");

function getResourceType(filename) {
  const extension = path.extname(filename).toLowerCase();
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
    ".ico",
  ];
  const videoExtensions = [".mp4", ".avi", ".mov", ".flv", ".wmv", ".mkv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "raw";
  }
}

const getDetail = async (req, res) => {
  try {
    const { daftar_surat_id } = req.body;
    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const role = await Role_user.findOne({
      where: { id: user.role_id },
    });

    const statusArray = getStatus(role.id, true);
    const status = statusArray.join(", ");

    const surat = await Daftar_surat.findOne({
      where: { id: daftar_surat_id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    if (!surat.dibaca) {
      const [affectedRowsCount, affectedRows] = await Daftar_surat.update(
        {
          dibaca: true,
          status,
        },
        {
          where: { id: daftar_surat_id },
          returning: true,
        }
      );

      surat = affectedRows[0];
    }

    res.status(StatusCodes.OK).json({ surat: surat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.get("/detail", getDetail);

module.exports = {
  router,
  getDetail,
};
