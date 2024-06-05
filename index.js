const express = require("express");
const { createServer } = require("node:http");
// const { Server } = require("socket.io");
// const cors = require("cors");

const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     // origin: "*",
//     origin: "https://9bs8nv4s-3000.asse.devtunnels.ms", //iyo sih , gaperlu harus e
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

require("dotenv").config();
require("pg");
const router = require("./src/routes/index.js");
const zip = require("express-easy-zip");

app.use(express.json());
// app.use(cors());
app.use(zip());
app.use(router);

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("send-message", (data) => {
//     console.log("sadwada", data.message);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

app.listen(process.env.PORT, () => {
  console.log("%s is running on port %s", process.env.LINK, process.env.PORT);

  console.log(`${process.env.LINK} on port ${process.env.PORT}`);
});
