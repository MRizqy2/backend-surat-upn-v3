const express = require("express");
const { StatusCodes } = require("http-status-codes");
const {
  DAFTAR_SURAT,
  JABATAN,
  AKSES_SURAT,
  USERS,
} = require("../../../models");
// const { use } = require("../auth_controller/authentication_controller");
const router = express.Router();

const getProgressBar = async (req, res) => {
  try {
    let i, jabatan_atas, jabatan;
    const { surat_id } = req.query;
    console.log("rggge", surat_id);
    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    const surat_user = await USERS.findOne({
      where: { id: surat.user_id },
    });

    const lastestAkses = await AKSES_SURAT.findAll({
      limit: 1,
      order: [["id", "DESC"]],
      where: { surat_id: surat.id },
    });
    console.log("dawdaw", lastestAkses[0].jabatan_id);
    jabatan = await JABATAN.findOne({
      where: { id: surat_user.jabatan_id },
    });
    console.log("pkfwpo");
    // jabatan_atas = jabatan;
    console.log("MVPEWC", jabatan.id); //2
    i = 0;
    if (jabatan.jabatan_atas_id != lastestAkses[0].jabatan_id) {
      do {
        jabatan = await JABATAN.findOne({
          where: { id: jabatan.jabatan_atas_id },
        });
        i++;
        console.log("mdopwa");
      } while (jabatan.jabatan_atas_id != lastestAkses[0].jabatan_id);
    }
    const currentJabatan = i + 1;
    console.log("opew", currentJabatan);

    // let currentJabatan = await JABATAN.findOne({
    //   where: { id: surat_user.jabatan_id },
    // });
    jabatan_atas = surat_user;
    console.log("asdws", jabatan_atas);
    i = 0;
    do {
      jabatan = await JABATAN.findOne({
        where: { id: jabatan.jabatan_atas_id },
      });
      i++;
      console.log(",muy5h");
    } while (jabatan.jabatan_atas_id);
    const totalJabatan = i + 1;
    console.log("kalsk", totalJabatan);

    // Only get the next level jabatan
    // if (currentJabatan && currentJabatan.jabatan_atas_id) {
    //   // currentJabatan = await JABATAN.findOne({
    //   //   where: { id: currentJabatan.jabatan_atas_id },
    //   // });

    //   console.log("dawdad", currentJabatan);
    //   if (currentJabatan && currentJabatan.id !== surat_user.jabatan_id) {
    //     currentJabatanLevel++;
    //   }
    // console.log("adwdad", currentJabatanLevel);
    // }

    const progressBarPercentage = (currentJabatan / totalJabatan) * 100;

    res.status(StatusCodes.OK).json({
      progressBar: progressBarPercentage,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.get("/", getProgressBar);

module.exports = {
  router,
  getProgressBar,
};
