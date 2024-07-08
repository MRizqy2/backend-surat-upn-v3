const express = require("express");
const router = express.Router();
const { DAFTAR_SURAT, USERS, JABATAN, STATUS } = require("../../../models");
const catchStatus = require("../status_surat_controller/catch_status");
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

    const daftarSurat = await DAFTAR_SURAT.findAll({
      where: { "$status.status$": { [Op.like]: `%${user_jabatan.name}%` } },
      include: [
        {
          model: STATUS,
          as: "status",
        },
      ],
    });

    const alamats = daftarSurat.map((surat) => surat.path);

    const formattedPathsPromises = alamats.map(async (file_path, index) => {
      file_path = decodeURIComponent(file_path);

      const fileName = await DAFTAR_SURAT.findOne({
        where: { path: file_path },
      });
      const reqStatus = {
        body: {
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

    res.header("Content-Type", "application/zip");
    res.zip({
      files: formattedPaths,
      filename: "download.zip",
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post("/", downloadAllUnsigned);

module.exports = { router, downloadAllUnsigned };
