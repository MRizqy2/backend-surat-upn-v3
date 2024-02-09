const express = require("express");
const app = express.Router();
const { iku } = require("./iku_controller");
const { indikator } = require("./indikator_controller");
const { repo } = require("./repo_controller");
const { strategi } = require("./strategi_controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", iku);
app.use("/", indikator);
app.use("/", repo);
app.use("/", strategi);

module.exports = app;
