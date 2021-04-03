const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const {generateMessage} = require('./utilis/messages');
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


    socket.on('join', ({username, room}) => {
        socket.join(room);

        socket.emit('message', generateMessage('Welcome to hell!!!!'));

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the room.`));

    });

    socket.on('sendMessage', (chatMessage, callback) => {
        io.emit('message', generateMessage(chatMessage));

        callback('Got it!!!');
    });    

    socket.on('sendLocation', (location, callback) => {
        const {latitude, longitude} = location;

        io.emit('locationMessage', generateMessage(`https://google.com/maps?q=${latitude},${longitude}`));

        callback('Location recieved');
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the room....Booo!!!'));
    });
});

server.listen(port, () => console.log(`Running on ${port}`));