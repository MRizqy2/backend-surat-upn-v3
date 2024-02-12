const express = require("express");
const app = express.Router();
const { postPerbaikan } = require("./post_perbaikan");

app.post("/", postPerbaikan);

module.exports = app;
