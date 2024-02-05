const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

// Endpoint untuk mengunduh blob
router.get(`/`, (req, res) => {
  try {
    let filepath = decodeURIComponent(req.query.filepath);
    console.log("Filepath 1:", filepath);
    filepath = path.resolve(__dirname, "../../../../", filepath);
    console.log("Filepath 2:", filepath);

    if (!fs.existsSync(filepath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found" });
    }
    const buffer = fs.readFileSync(filepath);
    res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

module.exports = router;
