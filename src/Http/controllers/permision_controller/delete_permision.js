const express = require("express");
const { Permision } = require("../../../models");
const router = express.Router();

const deletePermision = async (req, res) => {
  try {
    const { permision_id } = req.query;

    if (!permision_id) {
      return res
        .status(400)
        .json({ error: "Parameter 'permision_id' is required" });
    }

    const deletedPermision = await Permision.destroy({
      where: { id: permision_id },
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
