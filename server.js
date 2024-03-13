const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const activeUsers = {};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('user-joined', (userName) => {
        console.log('User joined:', userName);
        activeUsers[socket.id] = userName;
        io.emit('user-joined', userName);
        console.log('Active users:', activeUsers);
    });

    socket.on('message', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        const leftUser = activeUsers[socket.id];
        if (leftUser) {
            io.emit('user-disconnected', leftUser);
            delete activeUsers[socket.id];
        }
    });

    socket.on('get-active-users', () => {
        io.to(socket.id).emit('active-users-list', activeUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
