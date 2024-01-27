const express = require("express");
const { Daftar_surat } = require("../../../models");
// const { post } = require("./daftar_surat_controller");
const {
  deleteAksesSurat,
} = require("../akses_surat_controller/delete_akses_surat");
const {
  deleteTampilan,
} = require("../tampilan_surat_controller/delete_tampilan");
const { deleteStatus } = require("../status_surat_controller/delete_status");
const { deleteKomentar } = require("../komentar_controller/delete_komentar");
const {
  deleteNotifikasi,
} = require("../notifikasi_controller/delete_notifikasi");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { where } = require("sequelize");

const deleteSurat = async (req, res) => {
  try {
    const { surat_id } = req.query;

    // const user = await Users.findOne();
    // gk ke delete
    if (!surat_id) {
      return res.status(400).json({ error: "Parameter 'id' is required" });
    }

    //     // const suratFile = fs.unlink()
    //     const daftarSurat = await Daftar_surat.findOne({ where: { id: surat_id } });
    //     if (daftarSurat && daftarSurat.url) {
    //       //iso kah//oh iyo
    //       console.log("mwddp", daftarSurat.url); //eror
    //       fs.unlinkSync(daftarSurat.url); // Delete the file from disk
    //     }// opo atek sing bawah cuy
    // //bawah ndi
    const reqDelete = {
      query: {
        surat_id: surat_id,
        from: `daftar_surat_controller/delete_daftar_surat.js`,
        // akses_surat_id: null,
        // tampilan_id: null,
        // status_id: null,
        // komentar_id: null,
        // jabatan_id: null,//okee
      },
    };

    const deletedAksesSurat = await deleteAksesSurat(reqDelete);
    const deletedTampilan = await deleteTampilan(reqDelete);
    const deletedStatus = await deleteStatus(reqDelete);
    const deletedKomentar = await deleteKomentar(reqDelete);
    const deletedNotifikasi = await deleteNotifikasi(reqDelete);

    const surat = await Daftar_surat.findOne({
      where: { id: surat_id },
    });
    const deletedSurat = await Daftar_surat.destroy({
      where: { id: surat_id },
    });

    if (deletedSurat) {
      const urlFile = surat.url;
      console.log("mmvpoewm", urlFile);
      const fileName = urlFile.split("/").pop();
      console.log("dawdawdasd", fileName);
      const filePath = path.join(
        __dirname,
        "../../../../daftar_surat",
        fileName
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error:", err);
          return res.status(500).json({ error: "Failed to delete file" });
        }

        res.status(200).json({ message: "Surat deleted successfully" });
      });
      // res.status(200).json({ message: "Surat deleted successfully" });
    } else {
      res.status(404).json({ error: "Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteSurat);

module.exports = {
  deleteSurat,
  router,
};
