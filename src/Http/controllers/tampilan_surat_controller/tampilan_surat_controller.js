const express = require("express");
const app = express.Router();
const { postTampilan } = require("./post_tampilan");
const { putTampilan } = require("./put_tampilan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postTampilan);
app.put("/update", putTampilan);

module.exports = app;
