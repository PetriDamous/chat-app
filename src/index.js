const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
require('dotenv').config({path: path.resolve(__dirname, '../env/dev.env')});

const app = express();

// Create instance of sever for socket.io to use
const server = http.createServer(app);

// Create instance of socket.io
const io = socketio(server);

const port = process.env.PORT;

const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

// Listens for client to connect
io.on('connection', (socket) => {
    socket.emit('message', 'Welcome to hell!!!!');

    socket.broadcast.emit('message', 'I user has joined the room.');

    socket.on('sendMessage', (chatMessage) => {
        io.emit('message', chatMessage);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the room....Booo!!!');
    });
});

server.listen(port, () => console.log(`Running on ${port}`));