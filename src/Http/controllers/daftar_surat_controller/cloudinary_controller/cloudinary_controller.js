// const { getDetail } = require("./get_cloudinary_detail");
// const { getDownload } = require("./get_cloudinary_download");
const postUpload = require("./post_cloudinary_upload");
const putCloudinary = require("./put_clodinary_update");

const express = require("express");
const app = express.Router();

// app.get("/detail", getDetail);
// app.get("/download", getDownload);
app.use("/upload", postUpload);
app.use("/update", putCloudinary);

module.exports = app;
