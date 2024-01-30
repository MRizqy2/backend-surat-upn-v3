const express = require("express");
const app = express.Router();
const getDownload = require("./get_multer_download");
const postMulter = require("./post_multer_upload");
const revisi = require("./put_multer_revisi");
const getDetail = require("./get_multer_detail").router;
const putMulterTtd = require("./put_multer_ttd");

app.use("/download", getDownload);
app.use("/upload", postMulter);
app.use("/revisi", revisi);
app.use("/detail", getDetail);
app.use("/ttd", putMulterTtd);

module.exports = app;
