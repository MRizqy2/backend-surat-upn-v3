const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { TEMPLATE_SURAT, JENIS_SURAT } = require("../../../../models");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const router = express.Router();

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
  res.json(
    await TEMPLATE_SURAT.findOne({ where: { id: req.query.template_id } })
  );
};

router.get("/detail", getDetail);

module.exports = {
  getDetail,
  router,
};
