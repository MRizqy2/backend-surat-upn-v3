const express = require("express");
const { Template_surat } = require("../../../models/index.js");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const deleteTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;

    if (!template_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'template_id' is required" });
    }

    const deleteSurat = await Template_surat.destroy({
      where: { id: template_id },
    });

    if (deleteSurat) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Template Surat deleted successfully" });
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
