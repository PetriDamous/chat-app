const chatForm = document.getElementById('chat-form');

// Connects client to server
const socket = io();

socket.on('message', (message) => {
    console.log(message)
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const chatMessage = e.target[0].value;
    
    socket.emit('sendMessage', chatMessage);
});