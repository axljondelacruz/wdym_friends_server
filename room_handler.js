const shortId = require('shortid')

const roomHandler = (io, socket, rooms) => {
  const create = (payload, callback) => {
    const room = {
      roomId: shortId.generate(),
      players: [
        {
          id: socket.id,
        },
      ],
      name: payload.name,
    }
    rooms.push(room)
    socket.join(room.roomId)
    io.to(room.roomId).emit('room:get', room)
    io.emit('rooms:update', rooms)
    callback(null, room.roomId)
  }

  const join = (payload, callback) => {
    const roomIndex = rooms.findIndex((room) => room.roomId === payload.roomId)
    if (roomIndex >= 0) {
      const room = rooms[roomIndex]
      if (room.players.find((p) => p.id === socket.id)) return callback(null)

      room.players.push({
        id: socket.id,
      })
      // rooms.push(room)
      socket.join(room.roomId)
      io.to(room.roomId).emit('room:get', room)
      callback(null, room)
    } else {
      callback({ error: true })
    }
  }

  const leave = (payload, callback) => {
    const roomIndex = rooms.findIndex((room) => room.roomId === payload.roomId)
    if (roomIndex >= 0) {
      const room = rooms[roomIndex]
      const playerIndex = room.players.findIndex(
        (player) => player.id === socket.id
      )
      if (playerIndex >= 0) {
        room.players.splice(playerIndex, 1)
        socket.leave(room.roomId)
        socket.to(room.roomId).emit('room:update', room)
        if (room.players.length === 0) {
          rooms.splice(roomIndex, 1)
          io.emit('rooms:update', rooms)
        }

        callback(null, payload)
      } else {
        callback({ error: true })
      }
    } else {
      callback({ error: true })
    }
  }

  socket.on('room:create', create)
  socket.on('room:join', join)
  socket.on('room:leave', leave)
}

module.exports = roomHandler
