const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
// const socketIo = require("socket.io");
const zip = require("express-easy-zip");
const { setSocketIo } = require("./src/Http/controllers/socket/socket.js");
const router = require("./src/routes/index.js");

require("dotenv").config();
require("pg");

app.use(express.json());
app.use(zip());
app.use(router);

setSocketIo(server);

server.listen(process.env.PORT, () => {
  console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
  console.log(`${process.env.LINK} on port ${process.env.PORT}`);
});
