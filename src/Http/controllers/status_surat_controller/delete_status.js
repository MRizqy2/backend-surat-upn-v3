const express = require("express");
const { Status } = require("../../../models");
const router = express.Router();

const deleteStatus = async (req, res) => {
  try {
    const { status_id, surat_id } = req.query;

    // if (!status_id) {
    //   return res.status(400).json({ error: "Parameter status_id is required" });
    // }
    const whereClause = {};
    if (req.query && status_id !== undefined) {
      whereClause.id = status_id;
    }
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
    }

    const deletedStatus = await Status.destroy({
      where: whereClause,
    });

    if (deletedStatus) {
      if (!req.query.from) {
        res.status(200).json({ message: "Status deleted successfully" });
      } else {
        return deletedStatus;
      }
    } else {
      res.status(404).json({ error: "Status not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteStatus);

module.exports = {
  deleteStatus,
  router,
};
