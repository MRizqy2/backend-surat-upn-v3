const express = require("express");
const app = express.Router();
const { postHeaderDaftarSurat } = require("./post_header_daftar_surat");
const { putHeaderDaftarSurat } = require("./put_header_daftar_surat");

app.post("/", postHeaderDaftarSurat);
app.put("/", putHeaderDaftarSurat);

module.exports = app;
