const express = require("express");
const app = express.Router();
const { postStatus } = require("./post_status");
const { putStatus } = require("./put_status");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postStatus);
app.put("/", putStatus);

module.exports = app;
