const cloudinary = require("../../../../../config/cloudinaryConfig");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const {
  Template_surat,
  Jenis_surat,
  Daftar_surat,
  Users,
} = require("../../../../models");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const router = express.Router();
const { putStatus } = require("../../status_surat_controller/put_status");
const { postRepo } = require("../../repo_controller/post_repo");

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
    const { surat_id } = req.query;
    if (!req.files["surat"]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing files in request" });
    }
    // const judul = req.files["surat"][0].originalname;
    //   where: { id: jenis_id },
    // };
    // const judulCheck = await Template_surat.findOne({ where: { judul } });
    //   const jenis = await Jenis_surat.findOne({
    //     where: { id: jenis_id },
    //   });

    // if (judulCheck) {
    //   return res.json("judul/file sudah ada");
    // }
    // let judul;
    let suratUrl;
    let thumbnailUrl;
    let judulEx;
    let data_surat;
    // if (!req.files["surat"]) {
    //   data_template_surat = Template_surat.findOne({
    //     where: { id: id },
    //   });
    // }
    if (req.files["surat"]) {
      // judulEx = judul + path.extname(req.files["surat"][0].originalname);
      // const jenis = await Jenis_surat.findOne({
      // judul = req.files["surat"][0].originalname;
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

    data_surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    if (!data_surat) {
      return res.status(404).json({ error: "Data surat not found" });
    }

    const suratUrlHttps = suratUrl.replace(/^http:/, "https:");
    const user_surat = await Users.findOne({
      where: { id: data_surat.user_id },
    });

    const user = await Users.findOne({
      where: { id: req.token.id },
    });

    const saveSurat = await Daftar_surat.update(
      {
        // judul: data_surat.judul,
        url: suratUrlHttps,
        // jenis_id: jenis.id || "",
        // deskripsi: deskripsi || "",
        thumbnail: thumbnailUrl || "",
      },
      {
        where: { id: surat_id }, // Gantilah dengan kriteria yang sesuai
        returning: true, // Menambahkan opsi returning
      }
    );

    const reqStatus = {
      body: {
        // persetujuan,
        // status,
        user: user,
        isSigned: true,
        from: "daftar_surat_controller/cloudinary_controller/put_cloudinary_update.js",
      },
      query: {
        surat_id: surat_id,
      },
      token: req.token,
    }; // statusse tetep di daftar tunggu
    const saveStatus = await putStatus(reqStatus); //
    console.log("nofeoe", saveStatus);
    // const reqRepo = {
    //   save: {
    //     surat_id: surat_id,
    //   },
    // };
    // const saveRepo = await postRepo(reqRepo);
    const reqNotif = {
      body: {
        surat_id: data_surat.id,
        jabatan_id_dari: user.jabatan_id,
        jabatan_id_ke: user_surat.jabatan_id,
        from: `daftar_surat_controller/cloudinary_controller/put_cloudinary_ttd`,
      },
    };
    await postNotif(reqNotif);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", saveSurat });
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
);

module.exports = router;