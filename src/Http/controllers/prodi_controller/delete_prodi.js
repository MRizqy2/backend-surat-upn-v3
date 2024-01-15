const express = require("express");
const { Prodi } = require("../../../models");
const isAdmin = require("../../middleware/adminMiddleware");
const router = express.Router();

const deleteProdi =
  (isAdmin,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Parameter id is required" });
      }

      const deletedProdi = await Prodi.destroy({
        where: { id: id },
      });

      if (deletedProdi) {
        res.status(200).json({ message: "Prodi deleted successfully" });
      } else {
        res.status(404).json({ error: "Prodi not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.delete("/", deleteProdi, isAdmin);

module.exports = {
  deleteProdi,
  router,
};
