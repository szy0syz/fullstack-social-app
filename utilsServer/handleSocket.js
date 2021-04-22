const { addUser, removeUser } = require("../utilsServer/roomActions");
const { loadMessages, sendMsg } = require("./messageAction");

function handle(io) {
  io.on("connection", (socket) => {
    socket.on("join", async ({ userId }) => {
      const users = await addUser(userId, socket.id);

      console.log("User connected", users);

      setInterval(() => {
        socket.emit("connectedUsers", {
          users: users.filter((user) => user.userId !== userId),
        });
      }, 5 * 1000);
    });

    socket.on("loadMessages", async (userId, messagesWith) => {
      const { chat, error } = await loadMessages(userId, messagesWith);

      if (!error) {
        socket.emit("messagesLoaded", { chat });
      }
    });

    socket.on("sendNewMsg", async (userId, msgSendToUserId, msg) => {
      const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);

      if (!error) {
        socket.emit("msgSent", { newMsg });
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("User disconnected", socket.id);
    });
  });
}

module.exports = handle;
