const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

router.get(`/`, (req, res) => {
  if (req.query.filepath !== undefined) {
    handleFileRequest(req, res);
  } else if (req.body.paths !== undefined) {
    handleZipRequest(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request" });
  }
});

function handleFileRequest(req, res) {
  try {
    let filepath = decodeURIComponent(req.query.filepath);
    filepath = path.resolve(__dirname, "../../../../", filepath);

    if (!fs.existsSync(filepath)) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }
    const buffer = fs.readFileSync(filepath);
    res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
}

function handleZipRequest(req, res) {
  const paths = req.body.paths;

  const formattedPaths = paths.map((file_path, index) => {
    return {
      path: path.join(__dirname, `../../../../${file_path}`),
      name: file_path.split("-").pop(),
    };
  });

  res.header("Content-Type", "application/zip");
  res.zip({
    files: formattedPaths,
    filename: "download.zip",
  });
}

router.post(`/`, async (req, res) => {});

module.exports = router;
