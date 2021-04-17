const { addUser, removeUser } = require('./utilsServer/roomActions');

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

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("User disconnected", socket.id);
    });
  });
}

module.exports = handle;
