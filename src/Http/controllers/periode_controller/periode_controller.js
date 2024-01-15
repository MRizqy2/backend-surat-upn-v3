const { getPeriode } = require("./get_periode");
const { postPeriode } = require("./post_periode");
const { putPeriode } = require("./put_periode");

const express = require("express");
const app = express.Router();

app.get("/", getPeriode);
app.post("/", postPeriode);
app.put("/", putPeriode);

module.exports = app;
