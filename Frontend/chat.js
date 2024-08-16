
document.addEventListener('DOMContentLoaded', () => {
    loadGroups();
});

// Function to load groups from the server
function loadGroups() {
    const token = sessionStorage.getItem('token');
    axios.get('http://localhost:5000/groups', { headers: { "Authorization": token } })
        .then(response => {
            const groups = response.data.groups;
            console.log(groups);
            
            displayGroups(groups);
        })
        .catch(error => {
            console.log(error);
        });
}

// Function to display groups in the sidebar
function displayGroups(groups) {
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = ''; // Clear existing groups

    groups.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group');
        groupElement.textContent = group.name;
        groupElement.dataset.groupId = group.id;
        groupElement.addEventListener('click', () => {
            loadGroupMessages(group.id);
            highlightActiveGroup(groupElement);
        });
        groupList.appendChild(groupElement);
    });
}

// Function to highlight the active group
function highlightActiveGroup(groupElement) {
    const allGroups = document.querySelectorAll('.group');
    allGroups.forEach(group => group.classList.remove('active'));
    groupElement.classList.add('active');
}

// Function to handle sending a message
function handleSend(event) {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    const token = sessionStorage.getItem('token');
    const currentGroupId = document.querySelector('.group.active')?.dataset.groupId;

    if (message && currentGroupId) {
        axios.post(`http://localhost:5000/groups/${currentGroupId}/messages`, { message: message }, { headers: { "Authorization": token } })
            .then(response => {
                const sentMessage = response.data.message;
                const storedMessages = getMessagesFromLocalStorage(currentGroupId);

                // Update stored messages and local storage
                const updatedMessages = [...storedMessages, sentMessage].slice(-10);
                storeMessagesInLocalStorage(currentGroupId, updatedMessages);
                displayMessages(updatedMessages);

                messageInput.value = ''; // Clear the input field
            })
            .catch(error => {
                console.log(error);
            });
    }
}
 
// Function to display messages in the chat window
function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = ''; // Clear previous messages
console.log(messages);

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${msg.name}: ${msg.message}`;
        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}
// Store messages in local storage
function storeMessagesInLocalStorage(groupId, messages) {
    const maxMessages = 10;
    const storedMessages = messages.slice(-maxMessages); // Store only the last 10 messages
    localStorage.setItem(`chatMessages_${groupId}`, JSON.stringify(storedMessages));
}

// Retrieve messages from local storage
function getMessagesFromLocalStorage(groupId) {
    return JSON.parse(localStorage.getItem(`chatMessages_${groupId}`)) || [];
}
function loadGroupMessages(groupId) {
    const storedMessages = getMessagesFromLocalStorage(groupId);
    if (storedMessages.length > 0) {
        displayMessages(storedMessages);
    } else {
        const token = sessionStorage.getItem('token');
        axios.get(`http://localhost:5000/groups/${groupId}/messages`, { headers: { "Authorization": token }, params: { limit: 10 } })
            .then(response => {
                const messages = response.data.messages;
                storeMessagesInLocalStorage(groupId, messages);
                displayMessages(messages);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function createGroup() {
    const groupName = prompt("Enter group name:");
    if (groupName) {
        const token = sessionStorage.getItem('token');
        axios.post('http://localhost:5000/groups', { name: groupName }, { headers: { "Authorization": token } })
            .then(response => {
                alert("Group created successfully!");
                const newGroup = document.createElement('div');
                newGroup.classList.add('group');
                newGroup.textContent = groupName;
                newGroup.dataset.groupId = response.data.group.id;
                document.getElementById('group-list').appendChild(newGroup);
            })
            .catch(error => {
                console.log(error);
            });
    }
}


// Function to join a group
function joinGroup() {
    const groupName = document.getElementById('join-group-name').value.trim();
    const token = sessionStorage.getItem('token');
console.log("send");

    if (groupName) {
        axios.post(`http://localhost:5000/groups/join`, { groupName }, { headers: { "Authorization": token } })
            .then(response => {
                
                alert(response.data.message);       

                // Optionally, refresh the group list to show the newly joined group
                loadGroups();
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            });
    } else {
        alert("Please enter a group name.");
    }
}



//Fetch new messages every 3 seconds
setInterval(() => {
    const currentGroupId = document.querySelector('.group.active')?.dataset.groupId;
    if (currentGroupId) {
        loadGroupMessages(currentGroupId);
    }
}, 3000);
