const express = require("express");
const { NOTIFIKASI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const catchPesan = require("./catch_pesan");
const app = express.Router();
const { socketEvent } = require("../socket/socketEvent");

const postNotif = async (req, res) => {
  try {
    const {
      surat_id,
      jabatan_id_dari,
      jabatan_id_ke,
      isSign,
      persetujuan,
      isRead,
      isDownloadUnsigned,
    } = req.body;

    const reqPesan = {
      body: {
        surat_id,
        jabatan_id: jabatan_id_dari,
        isSign,
        persetujuan,
        isRead,
        isDownloadUnsigned,
      },
    };

    const savePesan = await catchPesan(reqPesan);
    const notifikasi = await NOTIFIKASI.create({
      surat_id: surat_id,
      jabatan_id_dari: jabatan_id_dari,
      jabatan_id_ke: jabatan_id_ke,
      pesan: savePesan,
      terkirim: false,
    });

    if (notifikasi) {
      const reqSocket = {
        body: {
          api: "notifikation",
          dataServer: notifikasi.jabatan_id_ke,
        },
      };
      await socketEvent(reqSocket);
    }

    if (!req.body.from) {
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Notifikasi Sukses", notifikasi });
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
