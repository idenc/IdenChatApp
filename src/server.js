// Based off of https://socket.io/get-started/chat/

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const serveStatic = require('serve-static');

app.use(serveStatic(__dirname + '../dist'));

const usernameGen = {
    adjectives: ['small', 'ugly', 'big', 'beautiful', 'angry', 'sad', 'happy'],
    nouns: ['bear', 'panda', 'fish', 'frog', 'snake', 'kangaroo']
};

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
    const rA = Math.floor(Math.random() * usernameGen.adjectives.length);
    const rB = Math.floor(Math.random() * usernameGen.nouns.length);
    return usernameGen.adjectives[rA] + '_' + usernameGen.nouns[rB];
}

io.on('connection', (socket) => {
    socket.username = pickUsername();
    socket.color = Colors.random();
    console.log('a user connected. Giving them username ' + socket.username);
    socket.on('disconnect', () => {
        console.log(socket.username + ' disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', {
            'user': socket.username,
            'message': msg,
            'timestamp': Date.now(),
            'color': socket.color
        });
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
