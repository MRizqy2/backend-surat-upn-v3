// const { getIku } = require("./get_indikator");
const { postIku } = require("./post_indikator");
const { putIku } = require("./put_indikator");
// const { deleteIku } = require("./delete_iku");

const express = require("express");
const app = express.Router();

app.get("/", getIku);
app.post("/", postIndikator);
app.put("/", putIndikator);
app.delete("/", deleteIku);

module.exports = app;
