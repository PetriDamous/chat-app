const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const {generateMessage} = require('./utilis/messages');
const {addUser, removeUser, getUser,  getUsersInRoom} = require('./utilis/users');
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

    // Adds user to array and room
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room});

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', `Welcome to hell ${user.username}!!!!`));

        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room.`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

    });

    // User send message in joined room
    socket.on('sendMessage', (chatMessage, callback) => {

        const user = getUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username, chatMessage));
            callback('Message sent!!');
        }
 
    });    

    // User sends location message in joined room
    socket.on('sendLocation', (location, callback) => {
        const {latitude, longitude} = location;

        const user = getUser(socket.id);

        if (user) {
            io.to(user.room).emit('locationMessage', generateMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`));

            callback('Location recieved');
        }


    });

    // Disconnects user
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room....Booo!!!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
        
    });
});

server.listen(port, () => console.log(`Running on ${port}`));