const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const app = express();
const port = 3100;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const rooms = [];

io.on('connection', (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
