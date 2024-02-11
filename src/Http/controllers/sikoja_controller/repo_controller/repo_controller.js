const express = require("express");
const app = express.Router();
const { postRepo } = require("./post_repo");
const { getRepo } = require("./get_repo_all.js");
const { getRepoDetail } = require("./get_repo_detail.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postRepo);
app.get("/", getRepo);
app.get("/detail", getRepoDetail);

module.exports = app;
