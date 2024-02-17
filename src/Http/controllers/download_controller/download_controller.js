const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

router.post(`/`, (req, res) => {
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
    console.log("adaadwa", filepath);
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
}

function handleZipRequest(req, res) {
  const paths = req.body.paths;

  const formattedPaths = paths.map((file_path, index) => {
    const parts = file_path.split("-");
    const fileName = parts[parts.length - 2] + "-" + parts[parts.length - 1];
    return {
      path: path.join(__dirname, `../../../../${file_path}`),
      name: fileName,
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
