
    displayMessages = (messages) => {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = '';
        messages.forEach(messageObj => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${messageObj.userId} - ${messageObj.message}`;  // Display the message text
            chatContainer.appendChild(messageElement);
        });
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    document.addEventListener("DOMContentLoaded", function() {
        fetchMessage()
    });
    
    async function fetchMessage() {
        
        const token = sessionStorage.getItem('token');
    
        axios.get('http://localhost:5000/chat', { headers: { "Authorization": token } })
            .then(response => {
                console.log(response.data);
                const messages = response.data.message;  // Assuming the response structure you provided
                displayMessages(messages);  // Pass the fetched messages to displayMessages
            })
            .catch(error => {
                console.log(error);
            });
        
    }


async function handleSend(e) {
    e.preventDefault();
    const messageInput = document.getElementById('message');
  
        const message = messageInput.value.trim();
console.log(message);

        const token =sessionStorage.getItem('token');

        messageobj={
            message:message
        }
        axios.post('http://localhost:5000/chat',messageobj,{headers:{"Authorization":token}})
        .then(r=>{
            console.log(r.data);
            messageInput.value = '';
            displayMessages();
        })
        .catch(e=>{
            console.log(e.response);
            
        })
}



setInterval(fetchMessage,1000);