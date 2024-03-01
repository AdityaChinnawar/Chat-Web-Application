const socket = io();
console.log('Connected to server');
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


// Display user join message
socket.on('user-joined', (userName) => {
    const messagesDiv = document.getElementById('users');
    const joinMessageElement = document.createElement('div');
    joinMessageElement.textContent = `${userName} has joined the chat`;
    messagesDiv.appendChild(joinMessageElement);
});

