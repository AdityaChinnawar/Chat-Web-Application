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

// Listen for click event on the dropdown menu
document.getElementById('active-users-dropdown').addEventListener('click', () => {
    // Emit an event to the server to request the active users list
    socket.emit('get-active-users');
});

// Listen for server response with active users list
socket.on('active-users-list', (activeUsers) => {
    // Display the active users list in the dropdown menu
    const dropdownMenu = document.getElementById('active-users-dropdown');
    dropdownMenu.innerHTML = ''; // Clear previous content
    for (const userId in activeUsers) {
        const userName = activeUsers[userId];
        const userOption = document.createElement('option');
        userOption.textContent = userName;
        dropdownMenu.appendChild(userOption);
    }
});
