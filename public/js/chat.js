const $chatForm = document.getElementById('chat-form');
const $formInput = document.getElementById('form-input');
const $formSubmit = document.getElementById('form-submit');
const $sendLocation = document.getElementById("send-location");
const $message = document.getElementById('message');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationTemplate = document.getElementById('location-template').innerHTML;

// Connects client to server
const socket = io();

//Query string used for user name and room
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true}); 

// Listening for incoming messages
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    $message.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {
        location: location.text,
        createdAt: moment(location.createdAt).format('h:mm a')
    });

    $message.insertAdjacentHTML('beforeend', html);
});


// Send off messages
$chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const chatMessage = $formInput.value;
    $formSubmit.setAttribute('disabled', 'disabled');
    
    
    socket.emit('sendMessage', chatMessage, (message) => {
        console.log('Message recieved', message);
        $formSubmit.removeAttribute('disabled');
        $formInput.value = '';
        $formInput.focus();
    });
});

$sendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Your web browser does not support location findind');
    }

    $sendLocation.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;        

        socket.emit('sendLocation', {
            latitude,
            longitude
        }, 
        (message) => {
            $sendLocation.removeAttribute('disabled');
            console.log('Location shared', message);
        });
    });
});

socket.emit('join', {username, room});