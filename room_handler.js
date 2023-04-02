const shortId = require('shortid');

const roomHandler = (io, socket, rooms) => {
  const create = (payload, callback) => {
    console.log('creating room');
    const room = {
      roomId: shortId.generate(),
      players: [
        {
          id: socket.id,
          option: null,
          optionLock: false,
          score: 0,
        },
      ],
      vacant: true,
      private: true,
      name: payload.name,
    };
    rooms.push(room);
    socket.join(room.roomId);
    io.to(room.roomId).emit('room:get', room);
    socket.emit('room:created', rooms);
    callback(null, room.roomId);
  };

  const join = (payload, callback) => {
    console.log('joining room');
    const index = rooms.findIndex((room) => room.roomId === payload.roomId);
    if (index >= 0) {
      const room = rooms[index];
      if (room.players.find((p) => p.id === socket.id)) return callback(null);

      room.players.push({
        id: socket.id,
        option: null,
        optionLock: false,
        score: 0,
      });
      rooms.push(room);
      socket.join(room.roomId);
      io.to(room.roomId).emit('room:get', room);
      callback(null, room);
    } else {
      callback({ error: true });
    }
  };

  socket.on('room:create', create);
  socket.on('room:join', join);
};

module.exports = roomHandler;
