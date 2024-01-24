const cloudinaryController = require("./cloudinary_controller/cloudinary_controller");
const { deleteSurat } = require("./delete_daftar_surat");
const { getDaftarSurat } = require("./get_daftar_surat");

const express = require("express");

const app = express.Router();

app.get("/", getDaftarSurat);
app.use("/cloudinary", cloudinaryController);
app.delete("/delete", deleteSurat);

module.exports = app;
