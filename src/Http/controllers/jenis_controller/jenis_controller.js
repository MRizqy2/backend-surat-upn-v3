const { getAll } = require("./get_jenis");
const { postJenis } = require("./post_jenis");

const express = require("express");
const app = express.Router();

app.get("/", getAll);
app.post("/", postJenis);

module.exports = app;
