const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { DAFTAR_SURAT } = require("../../../models");
const { handleFileRequest } = require("./donwload_file_req");
const { handleZipRequest } = require("./download_zip_req");

router.post(`/`, (req, res) => {
  if (req.query.filepath !== undefined) {
    handleFileRequest(req, res);
  } else if (req.body.paths !== undefined) {
    handleZipRequest(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request" });
  }
});

module.exports = router;
