


 displayMessages=(messages)=> {
     const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Placeholder data
const messages = [
    "You joined",
    "Vaibhav joined",
    "Vaibhav: hello",
    "You: hi There",
    "Vaibhav: What is up?",
    "Vaibhav: All good"
];
document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem('token');

axios.get('http://localhost:5000/chat',{headers:{"Authorization":token}})
.then(r=>{
    console.log(r.data);
    
})
.catch(e=>{
    console.log(e);
    
})


   // displayMessages();

   
});

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
            displayMessages();
            messageInput.value = '';
        })
        .catch(e=>{
            console.log(e.response);
            
        })
}



