const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("../utilsServer/roomActions");
const { loadMessages, sendMsg, setMsgToUnread } = require("./messageAction");

function handle(io) {
  io.on("connection", (socket) => {
    socket.on("join", async ({ userId }) => {
      const users = await addUser(userId, socket.id);
      console.log(users);

      setInterval(() => {
        socket.emit("connectedUsers", {
          users: users.filter((user) => user.userId !== userId),
        });
      }, 10000);
    });

    socket.on("loadMessages", async ({ userId, messagesWith }) => {
      const { chat, error } = await loadMessages(userId, messagesWith);

      !error
        ? socket.emit("messagesLoaded", { chat })
        : socket.emit("noChatFound");
    });

    socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
      const receiverSocket = findConnectedUser(msgSendToUserId);

      if (receiverSocket) {
        // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
        io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
      }
      //
      else {
        await setMsgToUnread(msgSendToUserId);
      }

      !error && socket.emit("msgSent", { newMsg });
    });

    socket.on("deleteMsg", async ({ userId, messagesWith, messageId }) => {
      const { success } = await deleteMsg(userId, messagesWith, messageId);

      if (success) socket.emit("msgDeleted");
    });

    socket.on(
      "sendMsgFromNotification",
      async ({ userId, msgSendToUserId, msg }) => {
        const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
        const receiverSocket = findConnectedUser(msgSendToUserId);

        if (receiverSocket) {
          // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
          io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
        }
        //
        else {
          await setMsgToUnread(msgSendToUserId);
        }

        !error && socket.emit("msgSentFromNotification");
      }
    );

    socket.on("disconnect", () => removeUser(socket.id));
  });
}

module.exports = handle;
