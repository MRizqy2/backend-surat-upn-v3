const cloudinary = require("../../../../../../config/cloudinaryConfig");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../../../models");
const isAdmin = require("../../../../middleware/adminMiddleware");
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

const postCloudinary =
  (isAdmin,
  async function (req, res, next) {
    try {
      if (!req.files["surat"]) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing files in request" });
      }
      const { judul, deskripsi, jenis_id } = req.body;
      const jenis = await Jenis_surat.findOne({
        where: { id: jenis_id },
      });

      const judulEx = judul + path.extname(req.files["surat"][0].originalname);
      // const judul = req.files["surat"][0].originalname;
      // const judulCheck = await Template_surat.findOne({
      //   where: { judul_file },
      // });

      // if (judulCheck) {
      //   return res.json("judul/file sudah ada");
      // }

      let suratUrl;
      let thumbnailUrl;

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

      // Upload thumbnail to Cloudinary
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

      const suratUrlHttps = suratUrl.replace(/^http:/, "https:");

      const template_surat = await Template_surat.create({
        judul: judulEx,
        url: suratUrlHttps,
        jenis_id: jenis.id || "",
        deskripsi: deskripsi || "",
        thumbnail: thumbnailUrl || "",
      });

      return res
        .status(StatusCodes.CREATED)
        .json({ message: "File successfully uploaded", template_surat });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  });

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  postCloudinary,
  isAdmin
);

module.exports = router;
