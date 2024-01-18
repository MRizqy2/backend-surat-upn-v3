const express = require("express");
const { Permision } = require("../../../models");
const router = express.Router();

const deletePermision = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Parameter 'id' is required" });
    }

    const deletedPermision = await Permision.destroy({
      where: { id: id },
    });

    if (deletedPermision) {
      res.status(200).json({ message: "Permision deleted successfully" });
    } else {
      res.status(404).json({ error: "Permision not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deletePermision);

module.exports = {
  deletePermision,
  router,
};
