const express = require("express");
const { Daftar_surat } = require("../../../models");
const router = express.Router();

const deleteSurat = async (req, res) => {
  try {
    const { surat_id } = req.query;

    // const user = await Users.findOne();

    if (!surat_id) {
      return res.status(400).json({ error: "Parameter 'id' is required" });
    }

    const deletedSurat = await Daftar_surat.destroy({
      where: { id: surat_id },
    });

    if (deletedSurat) {
      res.status(200).json({ message: "Permision deleted successfully" });
    } else {
      res.status(404).json({ error: "Permision not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteSurat);

module.exports = {
  deleteSurat,
  router,
};
