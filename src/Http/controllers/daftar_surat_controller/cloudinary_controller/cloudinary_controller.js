// const { getDetail } = require("./get_cloudinary_detail");
// const { getDownload } = require("./get_cloudinary_download");
const postUpload = require("./post_cloudinary_upload");

const express = require("express");
const app = express.Router();

// app.get("/detail", getDetail);
// app.get("/download", getDownload);
app.use("/upload", postUpload);

module.exports = app;
