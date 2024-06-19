const express = require("express");
const router = express.Router();
const { NOTIFIKASI, USERS } = require("../../../models");

router.post("/api/socket-event", async (req, res) => {
  try {
    const io = req.io; // Get io instance from request
    const { api, dataServer, isForAll } = req.body;
    console.log(io);
    // const { idClient } = io.id

    if (api === "test") {
      if (isForAll) {
        io.emit("message", dataServer); // Emit message to all connected clients
      } else if (!isForAll) {
        io.to("contoh").emit(api, dataServer); // Emit message to a specific client
      }
    } else if (api === "get notifikation") {
      const notifikasi = await NOTIFIKASI.findone({
        where: { jabatan_id_ke: dataServer.id },
      });
      io.to(`${notifikasi.jabatan.id}`).emit("message", dataServer);
    } else if (api === "get mail") {
      io.emit("message", dataServer);
    } else if (api === "login") {
      const user = await USERS.findone({
        where: { id: dataServer.id },
      });
      io.join(user.jabatan_id);
    }

    res.status(200).send("Message sent");
  } catch (error) {
    console.error("socket error", error);
    res.status(500).send("Internal Server Error");
  }
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
