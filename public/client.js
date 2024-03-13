const socket = io();

console.log('Connected to server');

const userName = prompt('Please enter your name:');
if (userName) {
    socket.emit('user-joined', userName);
} else {
    alert('You must enter your name to join the chat.');
    location.reload();
}

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('message', { user: userName, text: message });
        messageInput.value = '';
    }
});

socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const usernameSpan = document.createElement('span');
    const textSpan = document.createElement('span');

    usernameSpan.textContent = data.user;
    textSpan.textContent = data.text;

    usernameSpan.classList.add('username');

    messageElement.appendChild(usernameSpan);
    messageElement.appendChild(document.createElement('br'));
    messageElement.appendChild(textSpan);

    if (data.user === userName) {
        messageElement.classList.add('sender-message');
    } else {
        messageElement.classList.add('receiver-message');
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user-joined', (userName) => {
    const messagesDiv = document.getElementById('messages');
    const joinMessageElement = document.createElement('div');
    joinMessageElement.classList.add('message');
    joinMessageElement.textContent = `${userName} has joined the chat`;
    messagesDiv.appendChild(joinMessageElement);
});

socket.on('user-disconnected', (leftUser) => {
    const messagesDiv = document.getElementById('messages');
    const leaveMessageElement = document.createElement('div');
    leaveMessageElement.classList.add('message');
    leaveMessageElement.textContent = `${leftUser} has left the chat`;
    messagesDiv.appendChild(leaveMessageElement);
});

socket.on('active-users-list', (activeUsers) => {
    const dropdownMenu = document.getElementById('active-users-list');
    dropdownMenu.innerHTML = '';
    for (const userId in activeUsers) {
        const userName = activeUsers[userId];
        const userListItem = document.createElement('li');
        userListItem.textContent = userName;
        dropdownMenu.appendChild(userListItem);
    }
});
