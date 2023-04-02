const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const roomHandler = require('./room_handler');

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const rooms = [];

io.on('connection', (socket) => {
  console.log(`connected: ${socket.id}`);
  roomHandler(io, socket, rooms);

  socket.emit('connected', rooms);

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
});

const port = 8080;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
