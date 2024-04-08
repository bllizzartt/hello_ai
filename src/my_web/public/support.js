document.getElementById('chat-container').addEventListener('click', function() {
    // Toggle between expanded and collapsed states
    if (this.classList.contains('chat-collapsed')) {
        this.classList.remove('chat-collapsed');
        this.classList.add('chat-expanded');
    } else {
        this.classList.remove('chat-expanded');
        this.classList.add('chat-collapsed');
    }
});

document.getElementById('send-btn').addEventListener('click', async function(event) {
    event.stopPropagation(); // Prevent toggling when interacting with send button
    const userInput = document.getElementById('user-input');
    const userText = userInput.value.trim();

    if (userText !== '') {
        appendMessage(userText, 'user');
        userInput.value = ''; // Clear input after sending

        try {
            const response = await sendMessageToAPI(userText);
            appendMessage(response, 'bot');
        } catch (error) {
            console.error('Error sending message to API:', error);
            appendMessage("try again.", 'error');
        }
    }
});

document.getElementById('user-input').addEventListener('click', function(event) {
    event.stopPropagation(); // This should prevent the event from bubbling up to the chat-container
});

function appendMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = sender;
    chatBox.appendChild(messageElement); // Append at the bottom
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}