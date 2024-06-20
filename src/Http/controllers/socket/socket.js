let io;

const getSocketIo = function () {
  return io;
};
const setSocketIo = function (value) {
  io = value;
  io.on("connection", (socket) => {
    socket.emit("welcome", { message: "Welcome to the server!" });

    socket.on("message", (data) => {
      console.log("wdqmdve[p", data);
      socket.join(data); //user jabatan.id
      socket.to(data).emit("message", { message: `private ${data}` });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = {
  getSocketIo,
  setSocketIo,
};

// // const socketIo = require("socket.io");
// const { Server } = require("socket.io");

// let io;

// function initSocket(server) {
//   io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("a user connected");
//     socket.emit("welcome", { message: "Welcome to the server!" });

//     socket.on("message", (data) => {
//       console.log(data);
//     });

//     // socket.on("disconnect", () => {
//     //   console.log("user disconnected");
//     // });
//   });
//   //   console.log(io);

//   return io;
// }

// function getIo(id) {
//   //   if (id) {
//   //     io.on("connection", (socket) => {
//   //       socket.join(`${id}`);
//   //     });
//   //   }

//   if (!io) {
//     throw new Error("Socket.io not initialized!");
//   }
//   return io;
// }

// module.exports = { initSocket, getIo };
