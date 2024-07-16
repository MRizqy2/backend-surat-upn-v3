const express = require("express");
const router = express.Router();
const {
  DAFTAR_SURAT,
  USERS,
  JABATAN,
  STATUS,
  AKSES_SURAT,
} = require("../../../models");
const fs = require("fs");
const { Op } = require("sequelize");
const path = require("path");
const { putStatus } = require("../status_surat_controller/put_status");

const downloadAllUnsigned = async (req, res) => {
  try {
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const user_jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    console.log("dada",user_jabatan.name);

    const daftarSurat = await DAFTAR_SURAT.findAll({
      where: {
        "$status.status$": { [Op.like]: `%Di Daftar Tunggu ${user_jabatan.name}%` },
        visible: true,
      },
      include: [
        {
          model: STATUS,
          as: "status",
        },
      ],
    });
    console.log("dadaaaaaas",user_jabatan.name);
    const alamats = daftarSurat.map((surat) => surat.path);
    console.log("asdwdad", alamats);

    const formattedPathsPromises = alamats.map(async (file_path, index) => {
      file_path = decodeURIComponent(file_path);

      const fileName = await DAFTAR_SURAT.findOne({
        where: { path: file_path },
      });

      const filePathFull = path.join(__dirname, `../../../../${file_path}`);

      // Check if file exists
      if (!fs.existsSync(filePathFull)) {
        throw new Error(`File not found: ${filePathFull}`);
      }

      const reqStatus = {
        body: {
          isDownloadUnsigned: true,
          from: "download_controller",
        },
        query: {
          surat_id: fileName.id,
        },
        token: { id: req.token.id },
      };
      await putStatus(reqStatus);

      return {
        path: path.join(__dirname, `../../../../${file_path}`),
        name: `${index + 1} ${fileName.judul}`,
      };
    });

    const formattedPaths = await Promise.all(formattedPathsPromises);
    console.log("dwadwadwad", formattedPaths);

    res.header("Content-Type", "application/zip");
    res.zip({
      files: formattedPaths,
      filename: "surat.zip",
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post("/", downloadAllUnsigned);

module.exports = { router, downloadAllUnsigned };
