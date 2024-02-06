const express = require("express");
const app = express.Router();
const postRepo = require("./post_repo").router;
const { getRepo } = require("./get_repo.js");
const { getRepoById } = require("./get_repo_by_id");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postRepo);
app.get("/", getRepo);
app.get("/:id", getRepoById);

module.exports = app;
