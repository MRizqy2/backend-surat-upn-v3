const express = require("express");
const router = express.Router();
const { DAFTAR_SURAT, USERS, JABATAN, STATUS } = require("../../../models");
const catchStatus = require("../status_surat_controller/catch_status");
const { Op } = require("sequelize");

const downloadAllUnsigned = async (req, res) => {
  try {
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const user_jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const daftarSurat = await DAFTAR_SURAT.findAll({
      where: { "$status.status$": { [Op.like]: `%${user_jabatan.name}%` } },
      include: [
        {
          model: STATUS,
          as: "status",
        },
      ],
    });

    // const statusSurat = await STATUS.findAll({
    //   where: { status: { [Op.like]: `%${user_jabatan.name}%` } },
    // });

    console.log("daftar surat = ", daftarSurat);
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post("/", downloadAllUnsigned);

module.exports = { router, downloadAllUnsigned };
