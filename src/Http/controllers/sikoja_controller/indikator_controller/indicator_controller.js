const { getIndikator } = require("./get_indikator");
const { getIndikatorDetail } = require("./get_indikator_detail");
const { postIndikator } = require("./post_indikator");
const { putIndikator } = require("./put_indikator");
const { deleteIndikator } = require("./delete_indikator");

const express = require("express");
const app = express.Router();

app.get("/", getIndikator);
app.get("/detail", getIndikatorDetail);
app.post("/", postIndikator);
app.put("/", putIndikator);
app.delete("/", deleteIndikator);

module.exports = app;
