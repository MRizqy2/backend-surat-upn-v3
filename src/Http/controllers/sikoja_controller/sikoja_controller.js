const express = require("express");
const app = express.Router();
const { postSikoja } = require("./post_sikoja");
const { updateSikoja } = require("./put_sikoja");
const { getSikoja } = require("./get_sikoja");
const { deleteSikoja } = require("./delete_sikoja");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postSikoja);
app.put("/", updateSikoja);
app.get("/", getSikoja);
app.delete("/", deleteSikoja);

module.exports = app;
