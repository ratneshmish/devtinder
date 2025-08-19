const socket = require("socket.io");

const initializesocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", ({ userId, targetId }) => {
      const roomId = [userId, targetId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ userId, targetId, text }) => {
      const roomId = [userId, targetId].sort().join("_");
      io.to(roomId).emit("messageReceived", { text, senderId: userId });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializesocket;
