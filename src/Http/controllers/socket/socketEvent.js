const express = require("express");
const router = express.Router();

router.post("/api/socket-event", (req, res) => {
  const io = req.io; // Get io instance from request
  const { api, dataServer, isForAll, idClient } = req.body;

  if (isForAll) {
    io.emit("message", dataServer); // Emit message to all connected clients
  } else {
    io.to(idClient).emit(api, dataServer); // Emit message to a specific client
  }

  res.status(200).send("Message sent");
});

module.exports = router;

//======================================================

// const express = require("express");
// // const http = require("http");
// const socketIo = require("socket.io");
// const bodyParser = require("body-parser");

// const app = express();
// // const server = http.createServer(app);

// app.use(bodyParser.json());

// const socketEvent = async (server, req, res) => {
//   const io = socketIo(server, {
//     cors: {
//       origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
//       methods: ["GET", "POST"],
//     },
//   });

//   const { api, dataServer, isForAll, idClient } = req.body;

//   if (isForAll) {
//     io.emit("message", dataServer); // Mengirim pesan ke semua client yang terhubung
//   } else {
//     io.to(idClient).emit("message", dataServer); // Mengirim pesan ke client tertentu
//   }

//   res.status(200).send("Message sent");
// };

// app.post("/api/socket-event", socketEvent);

// module.exports = { app, socketEvent };
//-=============================================
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

// const socketEvent = (io) => {
//   // let { api, dataServer, idData } = req.body;
//   let reqMessage;
//   console.log("loreng");
//   io.on("connection", (socket) => {
//     console.log("loreng2: ", socket.id);
//     io.emit("message", "Hello from server!");
//   });
//   console.log("loreng5");
// };
// module.exports = { socketEvent };

//=====================================================
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your frontend URL if different
//     methods: ["GET", "POST"],
//   },
// });

// const socketEvent = async (req, res) => {
//   let { api, dataServer, idData } = req.body;
//   let reqMessage;
//   console.log("loreng");
//   io.on("connection", (socket) => {
//     console.log("loreng2");
//     io.emit("message", "Hello from server!");
//     console.log(api);

//     socket.on("message", (id, data) => {
//       console.log("loreng3");
//       console.log(data);
//       idClient = id;
//     });

//     if (dataServer === "new notifikation") {
//       reqMessage = {
//         dataServer: dataServer,
//         idData: idData,
//       };
//       socket.emit(`message`, reqMessage);
//     } else io.emit("message", reqMessage);
//     console.log("loreng4");
//     // socket.on("disconnect", () => {
//     //     console.log("user disconnected");
//     //   });
//   });
//   console.log("loreng5");
// };
// module.exports = { socketEvent };

//=============================================================
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your frontend URL if different
//     methods: ["GET", "POST"],
//   },
// });

// const socketEvent = async (req, res) => {
//   const { api, dataServer, isForAll, idClient } = req.body;

//   io.on("connection", (socket) => {
//     console.log(api);

//     socket.on("message", (id, data) => {
//       console.log(data);
//       idClient = id;
//     });

//     if (isForAll) {
//       io.emit("message", dataServer);
//     } else socket.emit(`message`, dataServer);

//     // socket.on("disconnect", () => {
//     //     console.log("user disconnected");
//     //   });
//   });
// };
// module.exports = { socketEvent };
