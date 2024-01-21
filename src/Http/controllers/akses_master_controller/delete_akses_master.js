const express = require("express");
const { Akses_master } = require("../../../models");
const router = express.Router();

const deleteAksesMaster = async (req, res) => {
  try {
    const { akses_master_id } = req.query;

    if (!akses_master_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'akses_master_id' is required" });
    }

    const deletedAksesMaster = await Akses_master.destroy({
      where: { id: akses_master_id },
    });

    if (deletedAksesMaster) {
      res.status(200).json({ message: "Akses Master deleted successfully" });
    } else {
      res.status(404).json({ error: "Akses Master not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteAksesMaster);

module.exports = {
  deleteAksesMaster,
  router,
};
