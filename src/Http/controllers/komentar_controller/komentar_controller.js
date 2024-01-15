const { getAll } = require("./get_komentar_all");
const { getDetail } = require("./get_komentar_detail");
const { postKomentar } = require("./post_komentar");

const express = require("express");
const app = express.Router();

app.get("/", getAll);
app.get("/detail", getDetail);
app.post("/", postKomentar);

module.exports = app;
