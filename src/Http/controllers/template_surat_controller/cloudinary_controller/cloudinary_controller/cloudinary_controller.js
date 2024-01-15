const express = require("express");
const app = express.Router();

const { getDetail } = require("./get_cloudinary_detail");
const { getDownload } = require("./get_cloudinary_download");
const postCloudinary = require("./post_cloudinary_upload");
const putCloudinary = require("./put_cloudinary");

app.get("/detail", getDetail);
app.get("/download", getDownload);
app.use("/upload", postCloudinary);
app.use("/update", putCloudinary);

module.exports = app;
