const express = require("express");
const { Template_surat } = require("../../../models/index.js");
const router = express.Router();

const deleteTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;

    if (!template_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'template_id' is required" });
    }

    const deleteSurat = await Template_surat.destroy({
      where: { id: template_id },
    });

    if (deleteSurat) {
      res.status(200).json({ message: "Template Surat deleted successfully" });
    } else {
      res.status(404).json({ error: "Template Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteTemplate);
module.exports = { router, deleteTemplate };
