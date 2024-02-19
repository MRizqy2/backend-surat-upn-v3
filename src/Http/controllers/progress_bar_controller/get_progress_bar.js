const express = require("express");
const { StatusCodes } = require("http-status-codes");
const {
  DAFTAR_SURAT,
  JABATAN,
  AKSES_SURAT,
  USERS,
  STATUS,
} = require("../../../models");
const router = express.Router();

const getProgressBar = async (req, res) => {
  try {
    let i, jabatan;
    const { surat_id } = req.query;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    // console.log("ntebr", surat.id);

    if (!surat) {
      return console.log({
        error: "Daftar surat not found",
      }); //lah mau kok isok eror?/ akun opo/ gk  ih/ tak reset 1x/iyo/ok/sg biasa iku yaopo/hmmm
    }
    const statusSurat = await STATUS.findOne({
      //oke tak coba sek//sing perbaikan biasa ga iso dihapus// ketika buat surat, langsung ditolak trus diperbaiki//kok terminal e eror ngunu maneh ;v
      where: { surat_id: surat.id },
    });

    // console.log("pcqpo", statusSurat.status);

    let progressBarPercentage;
    if (statusSurat.status === "Surat Telah Ditandatangani") {
      progressBarPercentage = 100;
    } else {
      const surat_user = await USERS.findOne({
        where: { id: surat.user_id },
      });

      const lastestAkses = await AKSES_SURAT.findAll({
        limit: 1,
        order: [["id", "DESC"]],
        where: { surat_id: surat.id },
      });

      jabatan = await JABATAN.findOne({
        where: { id: surat_user.jabatan_id },
      });

      i = 0;
      if (jabatan.jabatan_atas_id != lastestAkses[0].jabatan_id) {
        do {
          jabatan = await JABATAN.findOne({
            where: { id: jabatan.jabatan_atas_id },
          });
          i++;
        } while (jabatan.jabatan_atas_id != lastestAkses[0].jabatan_id);
      }
      const currentJabatan = i + 1;

      jabatan = await JABATAN.findOne({
        where: { id: surat_user.jabatan_id },
      });
      i = 0;
      do {
        jabatan = await JABATAN.findOne({
          where: { id: jabatan.jabatan_atas_id },
        });
        i++;
      } while (jabatan.jabatan_atas_id);
      const totalJabatan = i + 1;

      progressBarPercentage = Math.ceil((currentJabatan / totalJabatan) * 100);
    }

    return {
      status: StatusCodes.OK,
      progressBar: progressBarPercentage,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
    };
  }
};

router.get("/", getProgressBar);

module.exports = {
  router,
  getProgressBar,
};
