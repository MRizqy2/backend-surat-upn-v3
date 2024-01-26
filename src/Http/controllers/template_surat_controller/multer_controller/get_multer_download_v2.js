const express = require("express");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

// Endpoint untuk mengunduh file
const getDownloadv2 = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.resolve(
      __dirname,
      "../../../../../template_surat/",
      filename
    ); //cuman iki link e gk sesuai sg disave pas upload

    // Gunakan metode res.download untuk mengirimkan file ke pengguna
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
//sek memahami T_T
router.get("/:filename", getDownloadv2);

module.exports = router;
