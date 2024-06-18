const express = require("express");
const { NOTIFIKASI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const catchPesan = require("./catch_pesan");
const app = express.Router();
const { socketEvent } = require("../socket/socketEvent");

const postNotif = async (req, res) => {
  try {
    const { surat_id, jabatan_id_dari, jabatan_id_ke, isSign, persetujuan } =
      req.body;

    const reqPesan = {
      body: {
        surat_id,
        jabatan_id: jabatan_id_dari,
        isSign,
        persetujuan,
      },
    };

    const savePesan = await catchPesan(reqPesan);
    const notifikasi = await NOTIFIKASI.create({
      surat_id: surat_id,
      jabatan_id_dari: jabatan_id_dari,
      jabatan_id_ke: jabatan_id_ke,
      pesan: savePesan,
    });

    console.log("lorem");

    if (notifikasi) {
      console.log("lorem2");

      // let idSocket, dataSocket;
      // socket.on("message", (id,data) => {
      //   console.log(id, data)

      // })
      const reqSocket = {
        body: {
          api: "notifikation",
          dataServer: "new notifikation",
          idData: jabatan_id_ke,
        },
      };
      socketEvent(reqSocket);
      console.log("lorem3");
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
