const socket = io();

// Prompt the user for their name
const userName = prompt('Please enter your name:');
if (userName) {
    socket.emit('user-joined', userName);
} else {
    alert('You must enter your name to join the chat.');
    location.reload(); 
}

// Handle form submission
document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('message', { user: userName, text: message }); 
        messageInput.value = '';
    }
});

// Display incoming messages
socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.user}: ${data.text}`; 
    messagesDiv.appendChild(messageElement);
});

// Display user join message
socket.on('user-joined', (userName) => {
    const messagesDiv = document.getElementById('messages');
    const joinMessageElement = document.createElement('div');
    joinMessageElement.textContent = `${userName} has joined the chat`;
    messagesDiv.appendChild(joinMessageElement);
});
