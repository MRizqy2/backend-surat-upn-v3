const express = require("express");
const { Akses_master } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const deleteAksesMaster =
  (isAdmin,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Parameter 'id' is required" });
      }

      const deleteAksesMaster = await Akses_master.destroy({
        where: { id: id },
      });

      if (deleteAksesMaster) {
        res.status(200).json({ message: "Akses Master deleted successfully" });
      } else {
        res.status(404).json({ error: "Akses Master not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.delete("/", deleteAksesMaster, isAdmin);

module.exports = {
  deleteAksesMaster,
  router,
};
