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
  Jabatan,
  Users,
  Jenis_surat,
} = require("../../../../models");
// const getStatus = require("./status_controller");// kukirim yo cuy
const { postStatus } = require("../../status_surat_controller/post_status");
const {
  postTampilan,
} = require("../../tampilan_surat_controller/post_tampilan");
// const status = getStatus();
const { send } = require("./../send_controller");

const fs = require("fs");
const fetch = require("node-fetch");
const jabatan = require("../../../../models/jabatan");

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

const postUpload = async (req, res, next) => {
  try {
    const { judul, jenis_id, deskripsi } = req.body;
    const judulExt = judul + path.extname(req.files["surat"][0].originalname);
    const jenis = await Jenis_surat.findOne({
      where: { id: jenis_id },
    });

    const user = await Users.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await Jabatan.findOne({
      where: { id: user.jabatan_id },
    });

    let suratUrl;
    let thumbnailUrl;

    if (req.files["surat"]) {
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

    const suratUrlHttps = suratUrl.replace(/^http:/, "https:");

    const daftar_surat = await Daftar_surat.create({
      judul: judulExt,
      thumbnail: thumbnailUrl || "",
      jenis_id: jenis.id || "",
      user_id: req.token.id,
      deskripsi: deskripsi || "",
      tanggal: Date(),
      url: suratUrlHttps,
    });

    const reqStatus = {
      save: {
        user_id: user.id,
        surat_id: daftar_surat.id,
        from: `daftar_surat_controller/cloudinary_controller`,
      },
    };
    const saveStatus = await postStatus(reqStatus);

    const reqTampilan = {
      save: {
        jabatan_id: jabatan.id,
        user_id: user.id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/cloudinary_controller",
      },
    };

    const saveTampilan = await postTampilan(reqTampilan);

    let reqSend;
    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.jabatan_atas_id,
        from: "daftar_surat_controller/cloudinary_controller",
      },
    };
    await send(reqSend);

    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.id,
        from: "daftar_surat_controller/cloudinary_controller",
      },
    };
    await send(reqSend);

    res.status(StatusCodes.CREATED).json({
      message: "File successfully uploaded",
      daftar_surat,
      status: saveStatus,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]), //okeeh
  postUpload
);

module.exports = router;
