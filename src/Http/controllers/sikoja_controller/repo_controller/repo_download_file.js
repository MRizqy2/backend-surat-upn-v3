const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

// Endpoint untuk mengunduh blob
const getDownloadBlob = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, "../../../../daftar_surat/", filename);
    ```
    const path_file = req.params.path_file;
    // path_file = daftar_surat/filename
    // path_file = repo/filename

    const path_file = repo/surat tugas2/filename
    const filePath = path.resolve(__dirname, "../../../../../", path_file);
    filepath = ../../../../../repo/surat tugas2/filename

    https://localhost:3000/download - /repo/surat%20tugas2/filename
    ```;

    // Baca file sebagai buffer
    const buffer = fs.readFileSync(filePath);

    // Kirim buffer sebagai respons
    res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.get("/:filename", getDownloadBlob);

module.exports = router;
