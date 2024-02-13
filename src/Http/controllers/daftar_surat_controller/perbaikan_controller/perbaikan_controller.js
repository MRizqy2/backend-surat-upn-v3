const express = require("express");
const app = express.Router();
const postPerbaikan = require("./post_perbaikan");

app.use("/perbaikan", postPerbaikan);

module.exports = app;
