const {
  addUser,
  removeUser,
  findConnectedUser,
} = require('../utilsServer/roomActions');
const { loadMessages, sendMsg, setMsgToUnread } = require('./messageAction');

function handle(io) {
  io.on('connection', (socket) => {
    socket.on('join', async ({ userId }) => {
      const users = await addUser(userId, socket.id);

      console.log('User connected', users);

      setInterval(() => {
        socket.emit('connectedUsers', {
          users: users.filter((user) => user.userId !== userId),
        });
      }, 5 * 1000);
    });

    socket.on('loadMessages', async ({ userId, messagesWith }) => {
      console.log('@userId, messagesWith', userId, messagesWith);
      const { chat, error } = await loadMessages(userId, messagesWith);

      if (error) {
        socket.emit('noChatFound');
      } else {
        socket.emit('messagesLoaded', { chat });
      }
    });

    socket.on('sendNewMsg', async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
      const receiverSocket = findConnectedUser(msgSendToUserId);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
      } else {
        // 被叫方不在线
        await setMsgToUnread(msgSendToUserId)
      }

      if (!error) {
        socket.emit('msgSent', { newMsg });
      }
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      console.log('User disconnected', socket.id);
    });
  });
}

module.exports = handle;
