const express = require("express");
const http = require("http");
const morgan = require("morgan");
const winston = require("winston");
const app = express();
const server = http.createServer(app);
const zip = require("express-easy-zip");
const { setSocketIo } = require("./src/Http/controllers/socket/socket.js");
const router = require("./src/routes/index.js");

require("dotenv").config();
require("pg");

// Configure winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// Setup morgan to use winston for logging HTTP requests
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(express.json());
app.use(zip());
app.use(router);

setSocketIo(server);

server.listen(process.env.PORT, () => {
  logger.info(`${process.env.LINK} is running on port ${process.env.PORT}`);
});
