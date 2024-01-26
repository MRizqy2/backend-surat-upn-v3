const express = require("express");
const fs = require("fs");
const path = require("path");
const { Template_surat } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDownload = async (req, res) => {
  try {
    const { template_id } = req.query;
    // Find the template by id
    const template = await Template_surat.findOne({
      where: { id: template_id },
    });

    if (!template) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Template not found" });
    }

    // Get the file path
    const filePath = path.join(
      __dirname,
      "../../../../../template_surat",
      template.url
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found" });
    }

    // Set the headers and send the file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + path.basename(filePath)
    );
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Content-Type", "application/octet-stream");
    res.download(filePath);
  } catch (error) {
    //salah link kyk e
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getDownload);

module.exports = router;
