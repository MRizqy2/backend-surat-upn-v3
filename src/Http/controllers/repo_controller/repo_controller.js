const express = require("express");
const app = express.Router();
const { postRepo } = require("./post_repo");
const { getRepo } = require("./get_repo.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postRepo);
app.get("/", getRepo);

module.exports = app;
