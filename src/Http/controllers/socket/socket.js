// let io;

// const getSocketIo = function () {
//   if (!io) {
//     throw new Error("Socket.io not initialized!");
//   }
//   return io;
// };
// const setSocketIo = function (value) {
//   io = value;
// };

// module.exports = {
//   getSocketIo,
//   setSocketIo,
// };
//=======================================
const socketIo = require("socket.io");
// const { Server } = require("socket.io");

let io;

function setSocketIo(server) {
  io = socketIo(server, {
    cors: {
      origin: `${process.env.FRONTEND}`, // Sesuaikan dengan URL frontend Anda
      methods: ["GET", "POST"],
      // credentials: true,
    },
    // cookie: {
    //   name: "io",
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === 'production',
    //   sameSite: "Lax",
    // },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    // socket.emit("welcome", { message: "Welcome to the server!" });
    // socket.on("message", (data) => {
    //   socket.join(data);
    //   console.log("Entered room: " + data);
    // });

    // socket.on("message", (data) => {
    //   console.log(data);
    // });

    // socket.on("disconnect", () => {
    //   console.log("user disconnected");
    // });
  });
  // console.log(io);

  return io;
}

function getSocketIo() {
  //   if (id) {
  // io.on("connection", (socket) => {
  //   socket.join(`${id}`);
  // });
  //   }

  // io.on("connection", (socket) => {
  //   console.log("a user connected");
  //   // socket.emit("message", { message: "hello from server!" });

  //   // socket.on("message", (data) => {
  //   //   console.log(data);
  //   // });

  //   // socket.on("disconnect", () => {
  //   //   console.log("user disconnected");
  //   // });
  // });

  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  // console.log("test");
  // io.emit("message", { message: "Hello from server!" });
  // console.log(io);
  return io;
}

module.exports = { setSocketIo, getSocketIo };
