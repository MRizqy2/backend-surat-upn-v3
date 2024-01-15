const { postNomorSurat } = require("./post_nomor_surat");

const express = require("express");
const app = express.Router();

app.post("/", postNomorSurat);

module.exports = app;
