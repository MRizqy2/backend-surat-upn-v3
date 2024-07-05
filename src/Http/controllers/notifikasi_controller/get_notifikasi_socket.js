const express = require("express");
const {
  NOTIFIKASI,
  USERS,
  JABATAN,
  DAFTAR_SURAT,
  PRODI,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

const getNotifSocket = async (req, res) => {
  try {
    let notifikasi;
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    console.log("prodi user = ", user.prodi_id);
    console.log("jabatan user = ", user.jabatan_id);
    console.log("NAMA user = ", user.name);

    if (user.prodi_id === 1 || !user.prodi_id) {
      console.log("jabatan bukan prodi");
      notifikasi = await NOTIFIKASI.findAll({
        where: { jabatan_id_ke: user.jabatan_id, terkirim: false },
        attributes: ["id", "pesan", "createdAt"],
        include: [
          {
            model: JABATAN,
            as: "pengirim",
            attributes: ["id", "name"],
          },
          {
            model: DAFTAR_SURAT,
            as: "surat",
            attributes: ["id", "judul"],
            include: [
              {
                model: USERS,
                as: "user",
                attributes: ["id", "name"],
                include: [
                  {
                    model: PRODI,
                    as: "prodi",
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (notifikasi.length > 0) {
        await NOTIFIKASI.update(
          { terkirim: true },
          {
            where: {
              jabatan_id_ke: user.jabatan_id,
              terkirim: false,
            },
          }
        );
      }
    } else {
      console.log("jabatan adalah prodi");
      notifikasi = await NOTIFIKASI.findAll({
        where: {
          "$surat.user.prodi.id$": user.prodi_id,
          jabatan_id_ke: user.jabatan_id,
          terkirim: false,
        },
        attributes: ["id", "pesan", "createdAt"],
        include: [
          {
            model: JABATAN,
            as: "pengirim",
            attributes: ["id", "name"],
          },
          {
            model: DAFTAR_SURAT,
            as: "surat",
            attributes: ["id", "judul"],
            include: [
              {
                model: USERS,
                as: "user",
                attributes: ["id", "name"],
                include: [
                  {
                    model: PRODI,
                    as: "prodi",
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      console.log("sebelum update1");
      if (notifikasi.length > 0) {
        console.log("error poasmcp, ", notifikasi);
        await NOTIFIKASI.update(
          { terkirim: true },
          {
            where: {
              jabatan_id_ke: user.jabatan_id,
              "$surat.user.prodi.id$": user.prodi_id,
              terkirim: false,
            },
          }
        );
        console.log("setelah update");
      }
    }
    console.log("update Notif: ");
    if (notifikasi.length > 0) {
      res.status(StatusCodes.OK).json(notifikasi);

      console.log("pmpad");
    } else {
      res.status(StatusCodes.OK).json(0);
      console.log("apsmdpw");
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

app.get("/", getNotifSocket);

module.exports = {
  getNotifSocket,
  app,
};
