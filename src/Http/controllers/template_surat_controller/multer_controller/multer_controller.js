const express = require("express");
const app = express.Router();
const getDownload = require("./get_multer_download");
const getDownloadv2 = require("./get_multer_download_v2");
const postMulter = require("./post_multer_upload");

app.use("/download", getDownload);
app.use("/downloadv2", getDownloadv2);
app.use("/upload", postMulter);

module.exports = app;
