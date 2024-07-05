const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { DAFTAR_SURAT } = require("../../../models");

const handleZipRequest = async (req, res) => {
  const paths = req.body.paths;

  const formattedPathsPromises = paths.map(async (file_path, index) => {
    file_path = decodeURIComponent(file_path);
    const fileName = await DAFTAR_SURAT.findOne({
      where: { path: file_path },
    });

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
};

router.post("/", handleZipRequest);

module.exports = { router, handleZipRequest };
