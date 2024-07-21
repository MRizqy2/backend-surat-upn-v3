const express = require("express");
const { DAFTAR_SURAT } = require("../../../models");
const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { StatusCodes } = require("http-status-codes");
const visibleFalseSurat = async (req, res) => {
  try {
    const { surat_id } = req.body;
    await DAFTAR_SURAT.update({ visible: false }, { where: { id: surat_id } });

    res.status(StatusCodes.OK).json({ message: "Surat hide successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to hide surat" });
  }
};

app.delete("/", visibleFalseSurat);

module.exports = { visibleFalseSurat, app };
