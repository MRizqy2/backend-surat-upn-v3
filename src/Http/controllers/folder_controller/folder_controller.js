const express = require("express");
const app = express.Router();
const { postFolder } = require("./post_folder.js");
const { getFolder } = require("./get_folder.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postFolder);
app.get("/", getFolder);

module.exports = app;
