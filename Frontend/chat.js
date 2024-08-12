// Function to display messages
displayMessages = (messages) => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = ''; // Clear previous messages
    messages.forEach(messageObj => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${messageObj.id} - ${messageObj.message}`; // Display ID and message
        chatContainer.appendChild(messageElement);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
};

// Fetch messages when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchMessage();
});

// Fetch messages from the server
async function fetchMessage() {
    const token = sessionStorage.getItem('token');
    const storedMessages = getMessagesFromLocalStorage();
    
    const lastMessageId = storedMessages.length ? storedMessages[storedMessages.length - 1].id : 0;

    // Construct the URL correctly to include the last message ID
    axios.get(`http://localhost:5000/chat/afterId=${lastMessageId}`, { headers: { "Authorization": token } })
        .then(response => {
            const newMessages = response.data.message;

            if (newMessages.length > 0) {
                const updatedMessages = [...storedMessages, ...newMessages].slice(-10); // Keep only the last 10 messages
                storeMessagesInLocalStorage(updatedMessages);
                displayMessages(updatedMessages);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// Periodically fetch messages every 3 seconds (adjust the interval as needed)
setInterval(fetchMessage, 1000);

// Store messages in local storage
function storeMessagesInLocalStorage(messages) {
    const maxMessages = 10;
    const updatedMessages = messages.slice(-maxMessages); // Store only the last 10 messages
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
}

// Retrieve messages from local storage
function getMessagesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('chatMessages')) || [];
}

// Handle sending a new message
async function handleSend(e) {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    const token = sessionStorage.getItem('token');

    if (message) {
        const messageObj = { message: message };

        axios.post('http://localhost:5000/chat', messageObj, { headers: { "Authorization": token } })
            .then(response => {
                const sentMessage = response.data.message;
                const storedMessages = getMessagesFromLocalStorage();

                // Update the stored messages and local storage
                const updatedMessages = [...storedMessages, { id: response.data.id, message: sentMessage }].slice(-10);
                storeMessagesInLocalStorage(updatedMessages);
                displayMessages(updatedMessages);

                messageInput.value = ''; // Clear the input field
            })
            .catch(error => {
                console.log(error);
            });
    }
}
