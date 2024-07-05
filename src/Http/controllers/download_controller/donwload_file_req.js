const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { DAFTAR_SURAT } = require("../../../models");

const handleFileRequest = async (req, res) => {
  try {
    let filepath = decodeURIComponent(req.query.filepath);
    console.log("filepath1: ", filepath);
    filepath = path.resolve(__dirname, "../../../../", filepath);
    filepath = filepath.replace(/\\/g, "/");
    if (!fs.existsSync(filepath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found" });
    }
    // res.setHeader("Content-Disposition", `attachment; filename="123"`);

    res.download(filepath, (err) => {
      if (err) {
        console.error("Error:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    });
    // const buffer = fs.readFileSync(filepath);
    // res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", handleFileRequest);

module.exports = { router, handleFileRequest };
