const express = require("express");
const router = express.Router();
const http = require("http");
const { NOTIFIKASI, USERS } = require("../../../models");
const { getSocketIo, setSocketIo } = require("./socket");

const socketEvent = async (req, res) => {
  try {
    const { api, dataServer } = req.body;
    let message = "new";
    let user;
    console.log(api);
    const io = getSocketIo();

    if (api === "login") {
      message = `halo from server`;
      io.emit("welcome", message);
      console.log("socket login");
    } else if (api === "mail") {
      user = await USERS.findOne({
        where: { jabatan_id: dataServer },
      });
      message = `new`;
      io.emit("message", `private ${message} ${api}/${user.jabatan_id}`);
      console.log("socket mail");
    } else if (api === "notifikation") {
      console.log("notifikation");
      user = await USERS.findOne({
        where: { jabatan_id: dataServer },
      });
      message = `new`;
      io.emit("message", `private ${message} ${api}/${user.jabatan_id}`);
      console.log("socket notif");
    }

    console.log("socket is success");
  } catch (error) {
    console.error("socket error", error);
    // res.status(500).send("Internal Server Error");
  }
};

router.post("/api/socket-event", socketEvent);

module.exports = { socketEvent };
