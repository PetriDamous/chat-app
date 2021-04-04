// create users
const createUsers = (array) => {
    for(let i = 0; i <= 5; i++) {
        array.push({id: i, username: `user_${i}`, room: `room_${i}`})
    }
}


// create valid user
const user6 = {
    id: 6,
    username: ' user_6   ',
    room: 'room_1 '
};

// create invalid user
const user7 = {
    id: 7,
    username: '',
    room: 'dog'
}

// existing user
const user8 = {
    id: 8,
    username: ' user_6   ',
    room: 'room_1 '
};

module.exports = {
    createUsers,
    user6,
    user7,
    user8
}