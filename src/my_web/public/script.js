document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.chatbot-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-messages'); // Ensure this matches your HTML

    // Correctly toggle chat container visibility on click, but prevent it from doing so when interacting with input or button
    chatContainer.addEventListener('click', (event) => {
        if (event.target === chatContainer || event.target.closest('#close-btn')) { // Adjust condition if necessary
            chatContainer.classList.toggle('chat-expanded');
        }
    });

    // Explicitly prevent event from bubbling up when interacting with the input field or send button
    userInput.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    sendButton.addEventListener('click', async (event) => {
        event.stopPropagation(); // Prevent the chat from collapsing
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, 'user');
        userInput.value = '';

        // Placeholder for your actual send message logic or API call
        try {
            const response = "This is a simulated response for: " + userMessage;
            appendMessage(response, 'bot');
        } catch (error) {
            console.error('There was an error!', error);
            appendMessage('Failed to get a response. Please try again later.', 'error');
        }
    });

    function appendMessage(message, sender) {
        console.log('Appending message:', message); // Log the message being appended
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.textContent = message;
        console.log('Appending to:', chatBox); // Log the element to which you're appending
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    
});
