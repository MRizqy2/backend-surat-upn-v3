const express = require("express");
const {
  Notifikasi,
  Users,
  Jabatan,
  Daftar_surat,
  Status,
} = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

const getNotif = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.token.id },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const notifikasi = await Notifikasi.findAll({
      where: { jabatan_id_ke: user.jabatan_id },
      attributes: ["id"],
      include: [
        {
          model: Jabatan,
          as: "pengirim",
          attributes: ["id", "name"],
        },
        {
          model: Daftar_surat,
          as: "surat",
          attributes: ["id", "judul"],
          include: [
            {
              model: Status,
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
