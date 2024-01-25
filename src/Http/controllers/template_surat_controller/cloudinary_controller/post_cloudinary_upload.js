const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Template_surat, Jenis_surat } = require("../../../../models");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const router = express.Router();
const VercelBlob = require("../../../../../config/vercelConfig");

// function getResourceType(filename) {
//   // ... existing code ...
// }

const postCloudinary = async function (req, res, next) {
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

    let suratUrl;
    let thumbnailUrl;

    const file = new File([req.files["surat"][0].buffer], req.files["surat"][0].originalname, { type: req.files["surat"][0].mimetype });
suratUrl = await VercelBlob.uploadToVercel(file, file.name, file.type);

    // Upload thumbnail to VercelBlob
    if (req.files["thumbnail"]) {
      const file = req.files["thumbnail"][0];
      thumbnailUrl = await VercelBlob.uploadToVercel(file.buffer, file.originalname, file.mimetype);
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
};

router.post(
  "/",
  upload.fields([
    { name: "surat", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  postCloudinary
);

module.exports = router;