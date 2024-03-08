// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Object to store socket connections and usernames
const activeUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('User connected');

    // Emit 'user-joined' event when a new user connects
    socket.on('user-joined', (userName) => {
        console.log('User joined:', userName);
        activeUsers[socket.id] = userName;
        io.emit('user-joined', userName); // Broadcast to all connected clients
        console.log('Active users:', activeUsers); // Log active users for debugging
    });

    // Listen for messages
    socket.on('message', (message) => {
        // Broadcast message to all connected clients
        io.emit('message', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const leftUser = activeUsers[socket.id];
        if (leftUser) {
            io.emit('user-disconnected', leftUser); // Emit event to all connected clients
            delete activeUsers[socket.id]; // Remove the user from active users list
        }
    }); 
    // Handle request for active users list
    socket.on('get-active-users', () => {
        // Send the active users list to the client
        io.to(socket.id).emit('active-users-list', activeUsers);
    });   
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

