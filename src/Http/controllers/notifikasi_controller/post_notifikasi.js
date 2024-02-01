const express = require("express");
const { NOTIFIKASI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

const postNotif = async (req, res) => {
  const { surat_id, jabatan_id_dari, jabatan_id_ke } = req.body;

  try {
    const notifikasi = await NOTIFIKASI.create({
      surat_id: surat_id,
      jabatan_id_dari: jabatan_id_dari,
      jabatan_id_ke: jabatan_id_ke,
    });

    if (!req.body.from) {
      res
        .status(StatusCodes.CREATED)
        .json({ message: "File successfully uploaded", notifikasi });
    } else {
      return notifikasi;
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

app.post("/", postNotif);

module.exports = { postNotif, app };
