const socket=io('http://localhost:5000')

document.addEventListener('DOMContentLoaded', () => {
    loadGroups();
});

// Function to load groups from the server
function loadGroups() {
    const token = sessionStorage.getItem('token');
    axios.get('http://localhost:5000/groups', { headers: { "Authorization": token } })
        .then(response => {
            const groups = response.data.groups;
            displayGroups(groups);
        })
        .catch(error => {
            console.error(error);
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
            showGroupManagement(group.id);
            joinGroupForSocket(group.id)
        });
        groupList.appendChild(groupElement);
    });
}

function joinGroupForSocket(groupId)
{
console.log(socket.id,groupId);
socket.emit('joinGroup', groupId);
console.log("emit join group");

}


// Function to highlight the active group
function highlightActiveGroup(groupElement) {
    const allGroups = document.querySelectorAll('.group');
    allGroups.forEach(group => group.classList.remove('active'));
    groupElement.classList.add('active');
}

socket.on('rec', (groupId) => {
    
    // Fetch and display messages here...
    loadGroupMessages(groupId);
  
});


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
            const updatedMessages = [...storedMessages, sentMessage].slice(-10);
            storeMessagesInLocalStorage(currentGroupId, updatedMessages);
            displayMessages(updatedMessages);
            messageInput.value = ''; // Clear the input field
            socket.emit('send',currentGroupId);
            })
            .catch(error => {
                console.error(error);
            });
    }
}

// Function to display messages in the chat window
function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = ''; // Clear previous messages

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${msg.name}: ${msg.message}`;
        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// Function to create a new group
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
                console.error(error);
            });
    }
}

// Function to join a group by name
function joinGroup() {
    const groupName = document.getElementById('join-group-name').value.trim();
    const token = sessionStorage.getItem('token');

    if (groupName) {
        axios.post(`http://localhost:5000/groups/join`, { groupName }, { headers: { "Authorization": token } })
            .then(response => {
                alert(response.data.message);
                loadGroups(); // Refresh the group list
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    } else {
        alert("Please enter a group name.");
    }
}

// Function to show the group management section
function showGroupManagement(groupId) {
    const groupManagement = document.getElementById('group-management');
    groupManagement.style.display = 'block';
    groupManagement.dataset.groupId = groupId;
}

// Function to add a member to the group
function addMember() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const memberInfo = prompt("Enter member's email :");
    const token = sessionStorage.getItem('token');

    if (memberInfo) {
        axios.post(`http://localhost:5000/groups/${groupId}/members`, { memberInfo }, { headers: { "Authorization": token } })
            .then(response => {
                alert("Member added successfully!");
                // Optionally refresh the group member list
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

// Function to promote a member to admin
function promoteToAdmin() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const email = prompt("Enter the user email to promote:");
    const token = sessionStorage.getItem('token');

    if (email) {
        axios.patch(`http://localhost:5000/groups/${groupId}/admins`, { email:email, isAdmin: true }, { headers: { "Authorization": token } })
            .then(response => {
                alert("User promoted to admin successfully!");
                // Optionally refresh the group member list
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

// Function to remove a member from the group
function removeMember() {
    const groupId = document.getElementById('group-management').dataset.groupId;
    const email = prompt("Enter the user email to remove:");
    const token = sessionStorage.getItem('token');

    if (email) {
        axios.delete(`http://localhost:5000/groups/${groupId}/members/${email}`, { headers: { "Authorization": token } })
            .then(response => {
                alert("User removed from group successfully!");
                // Optionally refresh the group member list
            })
            .catch(error => {
                console.error(error);
                alert(error.response.data.error);
            });
    }
}

// Function to store messages in local storage
function storeMessagesInLocalStorage(groupId, messages) {
    const maxMessages = 10;
    const storedMessages = messages.slice(-maxMessages); // Store only the last 10 messages
    localStorage.setItem(`chatMessages_${groupId}`, JSON.stringify(storedMessages));
}

// Function to retrieve messages from local storage
function getMessagesFromLocalStorage(groupId) {
    return JSON.parse(localStorage.getItem(`chatMessages_${groupId}`)) || [];
}

// Function to load group messages
function loadGroupMessages(groupId) {
    
    const storedMessages = getMessagesFromLocalStorage(groupId);
   
        console.log("gett new msg");
        
        const token = sessionStorage.getItem('token');
        axios.get(`http://localhost:5000/groups/${groupId}/messages`, { headers: { "Authorization": token }, params: { limit: 10 } })
            .then(response => {
                const messages = response.data.messages;
                console.log(messages);
                messages.reverse();
                storeMessagesInLocalStorage(groupId, messages);
                displayMessages(messages);
            })
            .catch(error => {
                console.error(error);
            });
    
}