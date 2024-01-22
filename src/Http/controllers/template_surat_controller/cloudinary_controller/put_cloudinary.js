const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../../models");
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

const putCloudinary = async (req, res, next) => {
  try {
    const { judul, deskripsi, jenis_id } = req.body;
    const { template_id } = req.query;
    const jenis = await Jenis_surat.findOne({
      where: { id: jenis_id },
    });

    let thumbnailUrl, judulEx, data_template_surat, suratUrlHttps;

    if (req.files["surat"]) {
      judulEx = judul + path.extname(req.files["surat"][0].originalname);
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: getResourceType(req.files.surat[0].originalname),
              public_id: path.parse(req.files.surat[0].originalname),
            },
            (error, result) => {
              if (error) reject(error);
              else {
                suratUrl = result.url;
                resolve(result);
              }
            }
          )
          .end(req.files.surat[0].buffer);
      });
    }

    if (req.files["thumbnail"]) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: getResourceType(
                req.files.thumbnail[0].originalname
              ),
              public_id: path.parse(req.files.thumbnail[0].originalname),
            },
            (error, result) => {
              if (error) reject(error);
              else {
                thumbnailUrl = result.url;
                resolve(result);
              }
            }
          )
          .end(req.files.thumbnail[0].buffer);
      });
    }

    data_template_surat = await Template_surat.findOne({
      where: { id: template_id },
    });
    if (!data_template_surat) {
      return res.status(404).json({ error: "Template surat not found" });
    }
    //coba awkmu nembak postman nak server ku kik/ok
    if (req.files["surat"]) {
      suratUrlHttps = suratUrl.replace(/^http:/, "https:");
    }
    // sekarang suratUrlHttps dapat diakses di sini/

    const template_surat = await Template_surat.update(
      {
        judul: judulEx || data_template_surat.judul,
        url: suratUrlHttps || data_template_surat.url,
        jenis_id: jenis.id || "",
        deskripsi: deskripsi || "",
        thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: template_id },
        returning: true,
      }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", template_surat });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  putCloudinary
); // wokeeh

module.exports = router;
