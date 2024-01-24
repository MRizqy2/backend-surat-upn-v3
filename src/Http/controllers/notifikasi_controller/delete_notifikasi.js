const express = require("express");
const { Notifikasi } = require("../../../models");
const router = express.Router();

const deleteNotifikasi = async (req, res) => {
    try {
        const { notifikasi_id, surat_id } = req.query;
        const whereClause = {};
        if (req.query && notifikasi_id !== undefined) {
            whereClause.id = notifikasi_id;
        }
        if (req.query && surat_id !== undefined) {
            whereClause.surat_id = surat_id;
        }
        const notifikasi = await Notifikasi.findOne({
            where: whereClause,
        });
        if (!notifikasi) {
            if (!req.query.from) {
                res.status(404).json({ error: "Notifikasi not found" });
            } else {
                return notifikasi;
            }
        }
        const hapusNotifikasi = await Notifikasi.destroy({
            where: whereClause,
        });
        if (hapusNotifikasi) {
            if (!req.query.from) {
                res
                    .status(200)
                    .json({ message: "Notifikasi surat deleted successfully" });
            } else {
                return hapusNotifikasi;
            }
        } else {
            res.status(404).json({ error: "Notifikasi Surat not found" });
        }
    } catch (error) {    
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}   
router.delete("/", deleteNotifikasi);
module.exports = { router, deleteNotifikasi };