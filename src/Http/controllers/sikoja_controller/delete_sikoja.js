const express = require("express");
const router = express.Router();
const { SIKOJA } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const deleteSikoja = async (req, res) => {
  const { sikoja_id } = req.query;

  try {
    const sikoja = await SIKOJA.destroy({ where: { id: sikoja_id } });

    if (sikoja) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Sikoja deleted successfully" });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Sikoja not found" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.delete("/", deleteSikoja);

module.exports = {
  deleteSikoja,
  router,
};
