const express = require("express");
const { Template_surat } = require("../../../models/index.js");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const deleteTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;

    if (!template_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'template_id' is required" });
    }
    const template = await Template_surat.findOne({
      where: { id: template_id },
    });
    const deletedTemplate = await Template_surat.destroy({
      where: { id: template_id },
    });

    if (deletedTemplate) {
      const urlFile = template.url;
      console.log("mmvpoewm", urlFile);
      const fileName = urlFile.split("/").pop();
      console.log("dawdawdasd", fileName);
      const filePath = path.join(
        __dirname,
        "../../../../template_surat",
        fileName
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error:", err);
          return res.status(500).json({ error: "Failed to delete file" });
        }

        res
          .status(200)
          .json({ message: "Template surat deleted successfully" });
      });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Template Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteTemplate);

module.exports = { router, deleteTemplate };
