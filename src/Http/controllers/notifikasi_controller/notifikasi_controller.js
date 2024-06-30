const { postNotif } = require("./post_notifikasi");
const { getNotif } = require("./get_notifikasi");
const { deleteNotifikasi } = require("./delete_notifikasi");
const { deleteAllNotifikasi } = require("./delete_all_notifikasi");
const { getNotifSocket } = require("./get_notifikasi_socket");
const express = require("express");
const app = express.Router();

app.post("/", postNotif);
app.get("/", getNotif);
app.get("/notif-socket", getNotifSocket);
app.delete("/", deleteNotifikasi);
app.delete("/all", deleteAllNotifikasi);

module.exports = app;
