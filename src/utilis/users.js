users = [];


// Add user
const addUser = ({id, username, room}) => {
    // Check if data is valid
    if (!username || !room) return {error: 'User name and room are required.'};

    // Sanitize data
    username = username.toLowerCase().trim();
    room = room.toLowerCase().trim();

    // Check to see if user exists
    const doesUserExist = users.find(user => user.username === username && user.room === user.room);  

    if (doesUserExist) return {error: 'User name taken for this room.'};

    const user = {id, username, room};

    // Add user to array
    users.push(user);

    // Return user
    return {user};
};

// Remove user
const removeUser = (id) => {
    const idx = users.findIndex(user => user.id === id);

    if (idx !== -1) return users.splice(idx, 1)[0];
};

// Find user
const getUser = (id) => users.find(user => user.id === id);

// Find user by room
const getUsersInRoom = (room) => users.filter(user => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};