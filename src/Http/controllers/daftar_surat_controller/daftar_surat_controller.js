const cloudinaryController = require("./cloudinary_controller/cloudinary_controller");
const { getDaftarSurat } = require("./get_daftar_surat");
const { getDaftarSuratV2 } = require("./get_daftar_surat_v2");
// require("./put_daftar_surat_persetujuan");
// require("./put_daftar_surat_status");

const express = require("express");

const app = express.Router();

app.get("/", getDaftarSurat);
app.get("/v2", getDaftarSuratV2);
app.use("/cloudinary", cloudinaryController);

module.exports = app;
