const express = require("express");
const app = express.Router();
const getDownload = require("./get_multer_download");
const postMulter = require("./post_multer_upload");

app.use("/download", getDownload);
app.use("/upload", postMulter);

module.exports = app;
