const express = require("express");
const { Akses_surat } = require("../../../models");
const jabatan = require("../../../models/jabatan");
const router = express.Router();

const deleteAksesSurat = async (req, res) => {
  try {
    console.log("mvprmvw", req.query.akses_surat_id);
    const { akses_surat_id, surat_id, jabatan_id } = req.query;
    // if (!akses_surat_id) {
    //   return res.status(400).json({ error: "Parameter 'id' is required" });
    // }//ws kehapus tapi kok console eror/iyo
    const whereClause = {}; //tak coba yo
    console.log("mvprmvw", akses_surat_id);
    if (req.query && akses_surat_id !== undefined) {
      console.log("mlvewm", akses_surat_id);
      whereClause.id = akses_surat_id;
    } //looo kok jalan/ yg mana/ baris ygmana
    if (req.query && surat_id !== undefined) {
      whereClause.surat_id = surat_id;
      console.log("ekp[rkv");
    } // ga oleh atek kurawal ga si?//bagian ketika req
    if (req.query && jabatan_id !== undefined) {
      whereClause.jabatan_id = jabatan_id;
    }
    console.log("vrvk[ew[rkv", whereClause);

    const deletedAksesSurat = await Akses_surat.destroy({
      where: whereClause,
    });

    if (deletedAksesSurat) {
      if (!req.query.from) {
        res.status(200).json({ message: "Akses Surat deleted successfully" });
      } else {
        return deletedAksesSurat;
      }
    } else {
      res.status(404).json({ error: "Akses Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteAksesSurat);

module.exports = {
  deleteAksesSurat,
  router,
};
