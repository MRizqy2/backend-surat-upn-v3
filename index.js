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

//======================================================

// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// // const socketIo = require("socket.io");
// const zip = require("express-easy-zip");
// const { setSocketIo } = require("./src/Http/controllers/socket/socket.js");
// const router = require("./src/routes/index.js");

// require("dotenv").config();
// require("pg");

// app.use(express.json());
// app.use(zip());
// app.use(router);

// setSocketIo(server);

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });

//===================================
// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socketIo = require("socket.io");
// const zip = require("express-easy-zip");
// const { setSocketIo } = require("./src/Http/controllers/socket/socket.js");
// const router = require("./src/routes/index.js");

// require("dotenv").config();
// require("pg");

// app.use(express.json());
// app.use(zip());
// app.use(router);

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your frontend URL if different
//     methods: ["GET", "POST"],
//   },
// });
// // const io = socketIo(server);

// setSocketIo(io);

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });
//========================

// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const { initSocket } = require("./src/Http/controllers/socket/socket");
// // console.log("m;awmd", server);
// // const socketIo = require("socket.io");
// const { socketEvent } = require("./src/Http/controllers/socket/socketEvent.js");

// require("dotenv").config();
// // require("pg"); // Remove if not using PostgreSQL

// const router = require("./src/routes/index.js");
// const zip = require("express-easy-zip");

// // Initialize socket connection
// const io = initSocket(server);
// // const io = socketIo(server, {
// //   cors: {
// //     origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
// //     methods: ["GET", "POST"],
// //   },
// // });
// app.use(express.json());
// // app.use(cors()); // Uncomment if using CORS from a different domain
// app.use(zip());
// app.use(router);

// // Initialize socket connection
// // io.on("connection", (socket) => {
// //   console.log("a user connected");
// //   socket.emit("welcome", { message: "Welcome to the server!" });

// //   socket.on("message", (data) => {
// //     console.log(data);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("user disconnected");
// //   });
// // });

// // // Add socket instance to request
// // app.use((req, res, next) => {
// //   req.io = io;
// //   next();
// // });

// // // Use socket event router
// // app.use(socketEventRouter);

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });

//====================================

// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socketIo = require("socket.io");
// const socketEventRouter =
//   require("./src/Http/controllers/socket/socketEvent.js").router;

// require("dotenv").config();
// // require("pg"); // Remove if not using PostgreSQL

// const router = require("./src/routes/index.js");
// const zip = require("express-easy-zip");

// // Initialize socket connection
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
//     methods: ["GET", "POST"],
//   },
// });
// app.use(express.json());
// // app.use(cors()); // Uncomment if using CORS from a different domain
// app.use(zip());
// app.use(router);

// // Initialize socket connection
// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.emit("welcome", { message: "Welcome to the server!" });

//   socket.on("message", (data) => {
//     console.log(data);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// // Add socket instance to request
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Use socket event router
// app.use(socketEventRouter);

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });

//====================================
// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socketEvent = require("./src/Http/controllers/socket/socketEvent.js");

// require("dotenv").config();
// // require("pg"); // Remove if not using PostgreSQL

// const router = require("./src/routes/index.js");
// const zip = require("express-easy-zip");

// // Initialize socket connection

// app.use(express.json());
// // app.use(cors()); // Uncomment if using CORS from a different domain
// app.use(zip());
// app.use(router);

// const reqSocket = {
//   body: {
//     api: "Server",
//     data: "You are connected",
//   },
// };
// app.use(socketEvent(server));

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);
//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });

//========================
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server, {
// //   cors: {
// //     origin: "http://localhost:3000", // Replace with your frontend URL if different
// //     methods: ["GET", "POST"],
// //   },
// // });

// require("dotenv").config();
// // require("pg"); // Remove if not using PostgreSQL

// const router = require("./src/routes/index.js");
// const zip = require("express-easy-zip");
// const { socketEvent } = require("./src/Http/controllers/socket/socketEvent.js");

// app.use(express.json());
// // app.use(cors()); // Uncomment if using CORS from a different domain
// app.use(zip());
// app.use(router);

// socketEvent(server);
// // io.on("connection", (socket) => {
// //   io.emit("message", "Hello from server!");
// // });

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);

//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });

//==================================
// const express = require("express");
// const http = require("http");
// // const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server, {
// //   cors: {
// //     origin: "http://localhost:3000", // Replace with your frontend URL if different
// //     methods: ["GET", "POST"],
// //   },
// // });

// require("dotenv").config();
// // require("pg"); // Remove if not using PostgreSQL

// const router = require("./src/routes/index.js");
// const zip = require("express-easy-zip");
// const { socketEvent } = require("./src/Http/controllers/socket/socketEvent.js");

// app.use(express.json());
// // app.use(cors()); // Uncomment if using CORS from a different domain
// app.use(zip());
// app.use(router);

// const reqSocket = {
//   body: {
//     api: "Server",
//     data: "You are connected",
//     idData: "",
//   },
// };
// socketEvent(reqSocket);

// server.listen(process.env.PORT, () => {
//   console.log("%s is running on port %s", process.env.LINK, process.env.PORT);

//   console.log(`${process.env.LINK} on port ${process.env.PORT}`);
// });
