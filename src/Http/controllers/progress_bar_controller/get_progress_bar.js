const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { DAFTAR_SURAT, JABATAN, USERS} = require("../../../models");
// const { use } = require("../auth_controller/authentication_controller");
const router = express.Router();

const getProgressBar = async (req, res) => {
    try {
      const { surat_id } = req.query;
      const surat = await DAFTAR_SURAT.findOne({
        where: { id: surat_id },
      });
  
      if (!surat) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Daftar surat not found",
        });
      }
  
      const user = await USERS.findOne({
        where: {id: surat.user_id}
      })
  
      let currentJabatan = await JABATAN.findOne({
        where: { id: user.jabatan_id },
      });
  
      let totalJabatan = 4;
      let currentJabatanLevel = 1;
  
      // Only get the next level jabatan
      if (currentJabatan && currentJabatan.jabatan_atas_id) {
        currentJabatan = await JABATAN.findOne({
          where: { id: currentJabatan.jabatan_atas_id },
        });
        console.log("dawdad", currentJabatan);
        if (currentJabatan && currentJabatan.id !== user.jabatan_id) {
          currentJabatanLevel++;
        }
        console.log("dwadw",currentJabatanLevel);
      }
  
      const progressBarPercentage = (currentJabatanLevel / totalJabatan) * 100;
  
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