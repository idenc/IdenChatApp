// Based off of https://socket.io/get-started/chat/

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const serveStatic = require('serve-static');
const {v4: uuidv4} = require('uuid');

app.use(serveStatic(__dirname + '../dist'));

const usernameGen = {
    adjectives: ['small', 'ugly', 'big', 'beautiful', 'angry', 'sad', 'happy'],
    nouns: ['bear', 'panda', 'fish', 'frog', 'snake', 'kangaroo'],
    indexes: []
};


for (let i = 0; i < usernameGen.adjectives.length; i++) {
    for (let j = 0; j < usernameGen.nouns.length; j++) {
        usernameGen.indexes.push([i, j]);
    }
}

// Color code from https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
const Colors = {};
Colors.names = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

Colors.random = function () {
    let result;
    let count = 0;
    for (const prop in this.names)
        if (Math.random() < 1 / ++count)
            result = prop;
    // Avoid colour repetition
    delete this.result;
    return result;
};

function pickUsername() {
    // Picks a random username from a set of adjectives and nouns
    // This username is then removed from being able to be chosen by removing that index pair from available choices
    const roll = Math.floor(Math.random() * usernameGen.indexes.length);
    const indices = usernameGen.indexes.splice(roll, 1)[0];

    return usernameGen.adjectives[indices[0]] + '_' + usernameGen.nouns[indices[1]];
}

function commandError(socket, error) {
    socket.emit('command error', {message: error, id: uuidv4()})
}

function handleCommand(socket, command) {
    try {
        if (command.startsWith('/name')) {
            let name = command.split(" ");
            if (name.length !== 2) {
                commandError(socket, 'Incorrect number of arguments for changing name. Command should be in the form /name <new username>')
                return;
            }
            name = name[1];
            if (users.some(u => u.username === name)) {
                commandError(socket, `User with username ${name} already exists`);
                return;
            }
            for (let i = 0; i < users.length; i++) {
                if (users[i].username === socket.username) {
                    io.emit('user left', users[i].username);
                    socket.username = name;
                    users[i].username = name;
                    io.emit('user joined', users[i]);
                    socket.emit('user info', {username: socket.username, color: socket.color});
                    return;
                }
            }
        } else if (command.startsWith('/color')) {

        } else {
            commandError(socket, `No such command exists: ${command}`);
        }
    } catch (err) {
        console.err(err);
        commandError(socket, `Failed to apply command: ${command}`);
    }

}

const messages = [];
const users = [];

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log(`${socket.username} left`)
        io.emit('user left', socket.username);
    });
    socket.on('chat message', (msg) => {
        // Keep 200 most recent messages
        if (messages.length >= 200) {
            messages.shift();
        }
        // Handle commands
        if (msg.startsWith('/')) {
            handleCommand(socket, msg)
        } else {
            const message = {
                'user': socket.username,
                'message': msg,
                'timestamp': Date.now(),
                'color': socket.color,
                'id': uuidv4(),
            };
            messages.push(message);
            io.emit('chat message', message);
        }
    });

    socket.on('user info', (user) => {
        if (user) { // User has connected before
            socket.username = user.username;
            socket.color = user.color;
            if (!users.some(u => u.username === user.username)) {
                users.push(user);
            }
        } else { // New user
            socket.username = pickUsername();
            socket.color = Colors.random();
            user = {username: socket.username, color: socket.color};
            socket.emit('user info', user);
            users.push(user);
        }
        console.log('a user connected with username ' + socket.username);
        socket.broadcast.emit('user joined', user);
        socket.emit('chat info', {current_users: users, messages: messages});
        console.log(users);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
