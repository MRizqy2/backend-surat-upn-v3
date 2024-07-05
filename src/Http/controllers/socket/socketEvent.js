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

//===============================

// const express = require("express");
// const router = express.Router();
// const http = require("http");
// const { NOTIFIKASI, USERS } = require("../../../models");
// const { getSocketIo, setSocketIo } = require("./socket");

// const socketEvent = async (req, res) => {
//   try {
//     const { api, dataServer } = req.body;
//     let message = "new";
//     let user;
//     console.log(api);
//     const io = getSocketIo();

//     if (api === "login") {
//       message = `halo from server`;
//       io.emit("welcome", message);
//       // console.log(message);
//     } else if (api === "mail") {
//       // message = `halo from mail`;
//       // io.emit("welcome", message);
//       // console.log("data server", dataServer);
//       user = await USERS.findOne({
//         where: { jabatan_id: dataServer },
//       });
//       message = `new`;
//       io.to(user.jabatan_id).emit("message", `private ${message} ${api}`);

//       // if (user.prodi_id == 1) {
//       //   // console.log("tes");
//       //   message = `new`;
//       //   io.to(user.jabatan_id).emit("message", `private ${message} ${api}`);
//       // } else {
//       //   io.to(user.prodi_id).emit("message", `private ${message} ${api}`);
//       // }
//     } else if (api === "notifikation") {
//       console.log("data server", dataServer);
//       user = await USERS.findOne({
//         where: { jabatan_id: dataServer },
//       });
//       console.log(";mcpqw, ", user.jabatan_id);
//       message = `new`;
//       // io.to(user.jabatan_id).emit("notif", `private ${message} ${api} `);
//       io.emit("notif", `private ${message} ${api} `);

//       // if (user.prodi_id == 1) {
//       //   console.log("tes");
//       //   message = `new`;
//       //   io.to(user.jabatan_id).emit("message", `private ${message} ${api} `);
//       // } else {
//       //   io.to(user.prodi_id).emit("message", `private ${message} ${api} `);
//       // }
//     }

//     console.log("socket is success");
//   } catch (error) {
//     console.error("socket error", error);
//     // res.status(500).send("Internal Server Error");
//   }
// };

// router.post("/api/socket-event", socketEvent);

// module.exports = { socketEvent };

//==========================================

// const express = require("express");
// const router = express.Router();
// const http = require("http");
// const { NOTIFIKASI, USERS } = require("../../../models");
// const { getSocketIo, setSocketIo } = require("./socket");

// const socketEvent = async (req, res) => {
//   try {
//     const { api, dataServer } = req.body;
//     let message;
//     console.log(api);
//     const io = getSocketIo();

//     if (api === "login") {
//       message = `halo from server`;
//       io.emit("welcome", message);
//       console.log(message);
//     } else if (api === "mail") {
//       message = `halo from mail`;
//       io.emit("welcome", message);
//       console.log("data server", dataServer);
//       const user = await USERS.findOne({
//         where: { jabatan_id: dataServer },
//       });

//       if (user.prodi_id == 1) {
//         console.log("tes");
//         message = `baru`;
//         io.to(user.jabatan_id).emit("message", `private ${api} ${message}`);
//         // io.emit("message2", `private ${user.jabatan_id}: ${message}3`);
//         // console.log("tes2");
//         // io.on("connection", (socket) => {
//         //   socket.join(`${user.jabatan_id}`);
//         //   console.log(
//         //     `User with socket ID ${socket.id} joined room: ${user.jabatan_id}`
//         //   );
//         //   socket
//         //     .to(`${user.jabatan_id}`)
//         //     .emit("coba", { message: `private ${user.jabatan_id}` });
//         //   // socket.emit("coba", { message: "Hello from another file!" });
//         // });
//         // io.emit("message", { message: "Hello from another file!" });

//         // console.log(`User joined room: ${user.jabatan_id}`);
//       } else {
//         // io.join(user.prodi_id);
//         io.to(`${user.prodi_id}`).emit("coba", { message: "login success" });
//       }
//     }

//     console.log("socket is success");
//     // res.status(200).send("Message sent");
//   } catch (error) {
//     console.error("socket error", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// router.post("/api/socket-event", socketEvent);

// module.exports = { socketEvent };

//==========================================================================
// const express = require("express");
// const router = express.Router();
// const http = require("http");
// const { NOTIFIKASI, USERS } = require("../../../models");
// const { getSocketIo } = require("./socket");

// const socketEvent = async (req, res) => {
//   try {
//     const { api, dataServer } = req.body;
//     const { isForAll } = req.body;
//     console.log(api);
//     const io = getSocketIo();

//     io.emit("welcome", { message: "Welcome to the server!" });

//     if (api === "test") {
//       if (isForAll) {
//         io.emit("message", dataServer); // Emit message to all connected clients
//       } else if (!isForAll) {
//         io.to("contoh").emit(api, dataServer); // Emit message to a specific client
//       }
//     } else if (api === "post notifikation") {
//       const notifikasi = await NOTIFIKASI.findOne({
//         where: { jabatan_id_ke: dataServer.id },
//       });
//       io.to(`${notifikasi.jabatan.id}`).emit("message", dataServer);
//     } else if (api === "post mail") {
//       io.emit("message", dataServer);
//     } else if (api === "post login") {
//       const user = await USERS.findOne({
//         where: { id: dataServer.id },
//       });

//       if (user.prodi_id == 1) {
//         // io.emit("message", { message: "Hello from another file!" });
//         // io.join(user.jabatan_id);
//         io.to(`${user.jabatan_id}`).emit("coba", { message: "login success" });
//         io.emit("pesan", { message: "Hello from another file!" });
//         console.log("ampdmwp: ", user.jabatan_id);
//       } else {
//         // io.join(user.prodi_id);
//         io.to(`${user.prodi_id}`).emit("coba", { message: "login success" });
//       }
//     }
//     console.log("socket is success");
//     // res.status(200).send("Message sent");
//   } catch (error) {
//     console.error("socket error", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// router.post("/api/socket-event", socketEvent);

// module.exports = { socketEvent };
//=============================================

// const express = require("express");
// const router = express.Router();
// const http = require("http");
// const { NOTIFIKASI, USERS } = require("../../../models");
// const socketIO = require("socket.io");
// const server = http.createServer(router);

// const socketEvent = async (req, res) => {
//   try {
//     // let io = getIo(); // Get io instance from request
//     const io = socketIO(server, {
//       cors: {
//         origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
//         methods: ["GET", "POST"],
//       },
//     });
//     const { api, dataServer } = req.body;
//     const { isForAll } = req.body;
//     console.log(api);
//     // const { idClient } = io.id

//     if (api === "test") {
//       if (isForAll) {
//         io.emit("message", dataServer); // Emit message to all connected clients
//       } else if (!isForAll) {
//         io.to("contoh").emit(api, dataServer); // Emit message to a specific client
//       }
//     } else if (api === "post notifikation") {
//       const notifikasi = await NOTIFIKASI.findone({
//         where: { jabatan_id_ke: dataServer.id },
//       });
//       io.to(`${notifikasi.jabatan.id}`).emit("message", dataServer);
//     } else if (api === "post mail") {
//       io.emit("message", dataServer);
//     } else if (api === "post login") {
//       const user = await USERS.findOne({
//         where: { id: dataServer.id },
//       });

//       if (user.prodi_id == 1) {
//         io = io.emit("message", { message: "Hello from another file!" });
//         // io.join(user.jabatan_id);
//         // io.to(`${user.jabatan_id}`).emit("message", "login success");
//         console.log("ampdmwp: ", user.jabatan_id);
//       } else {
//         io.join(user.prodi_id);
//         io.to(`${user.prodi_id}`).emit("message", "login success");
//       }
//     }
//     console.log("socket is success");
//     // res.status(200).send("Message sent");
//   } catch (error) {
//     console.error("socket error", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// router.post("/api/socket-event", socketEvent);

// module.exports = { socketEvent, router };

//======================================================

// const express = require("express");
// const router = express.Router();
// const { NOTIFIKASI, USERS } = require("../../../models");

// router.post("/api/socket-event", async (req, res) => {
//   try {
//     const io = req.io; // Get io instance from request
//     const { api, dataServer } = req.body;
//     const { isForAll } = req.body;
//     // console.log(io);
//     // const { idClient } = io.id

//     if (api === "test") {
//       if (isForAll) {
//         io.emit("message", dataServer); // Emit message to all connected clients
//       } else if (!isForAll) {
//         io.to("contoh").emit(api, dataServer); // Emit message to a specific client
//       }
//     } else if (api === "post notifikation") {
//       const notifikasi = await NOTIFIKASI.findone({
//         where: { jabatan_id_ke: dataServer.id },
//       });
//       io.to(`${notifikasi.jabatan.id}`).emit("message", dataServer);
//     } else if (api === "post mail") {
//       io.emit("message", dataServer);
//     } else if (api === "post login") {
//       const user = await USERS.findOne({
//         where: { id: dataServer.id },
//       });

//       if (user.prodi_id == 1) {
//         io.emit("message", "login success");
//         io.join(user.jabatan_id);
//         io.to(`${user.jabatan_id}`).emit("message", "login success");
//       } else {
//         io.join(user.prodi_id);
//         io.to(`${user.prodi_id}`).emit("message", "login success");
//       }
//     }
//     console.log("socket is success");
//     // res.status(200).send("Message sent");
//   } catch (error) {
//     console.error("socket error", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// module.exports = router ;

//=================================================

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
