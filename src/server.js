const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const serveStatic = require('serve-static');

app.use(serveStatic(__dirname + '../dist'));

const usernameGen = {
    adjectives: ['small', 'ugly', 'big', 'beautiful', 'angry', 'sad', 'happy'],
    nouns: ['bear', 'panda', 'fish', 'frog', 'snake', 'kangaroo']
};

function pickUsername() {
    const rA = Math.floor(Math.random() * usernameGen.adjectives.length);
    const rB = Math.floor(Math.random() * usernameGen.nouns.length);
    return usernameGen.adjectives[rA] + '_' + usernameGen.nouns[rB];
}

io.on('connection', (socket) => {
    socket.username = pickUsername();
    console.log('a user connected. Giving them username ' + socket.username);
    socket.on('disconnect', () => {
        console.log(socket.username + ' disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', {'user': socket.username, 'message': msg});
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
