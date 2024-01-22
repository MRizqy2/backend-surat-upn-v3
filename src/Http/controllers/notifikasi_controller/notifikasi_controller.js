const { postNotif } = require("./post_notifikasi");
const { getNotif } = require("./get_notifikasi");
const express = require("express");
const app = express.Router();

app.post("/", postNotif);
app.get("/", getNotif);

module.exports = app;
