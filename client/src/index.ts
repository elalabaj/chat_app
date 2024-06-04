const elemMessages = document.getElementById('messages') as HTMLDivElement;
const elemMessageInput = document.getElementById('message-input') as HTMLTextAreaElement;
const elemButtonSend = document.getElementById('button-send') as HTMLButtonElement;
const elemUsername = document.getElementById('username') as HTMLElement;
const socket = new WebSocket('ws://localhost:3000');
let username: string | null = null;

function addReceivedMessage(user: string, message: string) {
    console.log('hello');
    elemMessages.innerHTML += `<div class="message-received">
        <div class="message-sender">${user}</div>
        <div class="message">${message}</div>
    </div>`;
    elemMessages.scrollIntoView(false);
}

function addSentMessage(message: string) {
    elemMessages.innerHTML += `<div class="message-sent">
        <div class="message">${message}</div>
    </div>`;
    elemMessages.scrollIntoView(false);
}

function addInfoMessage(message: string) {
    elemMessages.innerHTML += `<div class="message-info">
        <div class="message">${message}</div>
    </div>`;
    elemMessages.scrollIntoView(false);
}

function sendMessage(message: string) {
    if (socket.readyState == socket.CLOSED) {
        alert('Message not sent');
        return;
    }
    socket.send(JSON.stringify({user: username, message: message}));
    addSentMessage(message);
    elemMessageInput.value = "";
}

elemButtonSend.onclick = () => sendMessage(elemMessageInput.value);

elemMessageInput.onkeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage(elemMessageInput.value);
    }
};

socket.onopen = () => { 
    while (username == null) username = prompt('Enter your name:');
    socket.send(JSON.stringify({user: username, message: ''}));
    elemUsername.innerText = username;
};

socket.onclose = () => addInfoMessage('Disconnected from the server');

socket.onmessage = (message: MessageEvent) => {
    const body = JSON.parse(message.data);
    if (body.type == 'from-user') addReceivedMessage(body.user, body.message);
    if (body.type == 'info') addInfoMessage(body.message);
};