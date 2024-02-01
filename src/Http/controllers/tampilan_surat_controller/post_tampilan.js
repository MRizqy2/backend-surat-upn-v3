const express = require("express");
const app = express.Router();
const router = express.Router();
const { TAMPILAN, DAFTAR_SURAT, USERS, JABATAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { Sequelize } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postTampilan = async (req, res) => {
  try {
    const { surat_id, jabatan_id } = req.body;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    const jabatan = await JABATAN.findOne({
      where: {
        id: jabatan_id || user.jabatan_id,
      },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }
    let tamp_surat;
    let tamp_surat_atas;

    // const jabatan_atas = await Jabatan.findOne({
    //   where: { id: jabatan.jabatan_atas_id },
    // });

    tamp_surat_atas = await TAMPILAN.create({
      pin: false,
      dibaca: false,
      surat_id: surat.id,
      jabatan_id: jabatan.id,
    });
    // if (req.body.from) {
    //   tamp_surat = await Tampilan.create({
    //     pin: false,
    //     dibaca: false,
    //     surat_id: surat.id,
    //     jabatan_id: jabatan.id,
    //   });

    //   if (!jabatan_atas) {
    //     return res.status(StatusCodes.NOT_FOUND).json({
    //       error: "Jabatan not found",
    //     });
    //   }
    //   tamp_surat_atas = await Tampilan.create({
    //     pin: false,
    //     dibaca: false,
    //     surat_id: surat.id,
    //     jabatan_id: jabatan_atas.id,
    //   });
    // } else {
    // tamp_surat_atas = await Tampilan.create({
    //   pin: false,
    //   dibaca: false,
    //   surat_id: surat.id,
    //   jabatan_id: jabatan_atas.id,
    // });
    // }

    if (!req.body.from) {
      res.status(StatusCodes.OK).json({ tampilan: tamp_surat });
    } else {
      return {
        tamp_surat,
        tamp_surat_atas,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.post("/", postTampilan);

module.exports = {
  router,
  postTampilan,
  app,
};
