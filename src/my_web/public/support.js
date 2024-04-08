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
            appendMessage("Sorry, there was an error processing your message.", 'error');
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

async function sendMessageToAPI(message) {
    const apiUrl = 'https://yourserver.com/api/generate'; // Replace with your actual API endpoint

    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Assuming POST but adjust according to your server's API
            headers: {
                'Content-Type': 'application/json',
                // Include any other headers your server requires
            },
            body: JSON.stringify({
                prompt: message, // Adjust according to the expected request format of your server
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response; // Adjust the key according to your actual API response structure
    } catch (error) {
        console.error('Error fetching from API:', error);
        return "Sorry, there was an error processing your message."; // Provide a fallback message
    }
}
