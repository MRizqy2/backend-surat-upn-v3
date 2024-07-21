const express = require("express");
const app = express.Router();
const { postHeaderRepo } = require("./post_header_repo");
const { putHeaderRepo } = require("./put_header_repo");

app.post("/", postHeaderRepo);
app.put("/", putHeaderRepo);

module.exports = app;
