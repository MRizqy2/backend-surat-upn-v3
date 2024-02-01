const express = require("express");
const {
  NOTIFIKASI,
  USERS,
  JABATAN,
  DAFTAR_SURAT,
  STATUS,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

const getNotif = async (req, res) => {
  try {
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const notifikasi = await NOTIFIKASI.findAll({
      where: { jabatan_id_ke: user.jabatan_id },
      attributes: ["id"],
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
              model: STATUS,
              as: "status",
              attributes: ["status", "persetujuan"],
            },
          ],
        },
      ],
    });

    res.status(StatusCodes.OK).json(notifikasi);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

app.get("/", getNotif);

module.exports = {
  getNotif,
  app,
};
