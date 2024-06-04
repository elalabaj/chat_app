import WebSocket from 'ws'

const server = new WebSocket.Server({port: 3000});

const clients: WebSocket[] = [];
const clientNames: Map<WebSocket, string> = new Map();

server.on('connection', (webSocket: WebSocket) => {
    webSocket.on('message', (message: string) => {
        const body = JSON.parse(message);

        if (!clients.includes(webSocket)) {
            clients.push(webSocket);
            clientNames.set(webSocket, body.user);
            clients.forEach(client => {
                if (client != webSocket) {
                    client.send(JSON.stringify({type: 'info', message: body.user + ' has entered the chat'}));
                }
            });
        }
        else {
            clients.forEach(client => {
                if (client != webSocket) {
                    client.send(JSON.stringify({type: 'from-user', user: body.user, message: body.message}));
                }
            });
        }
    });

    webSocket.on('close', () => {
        clients.forEach(client => {
            if (client != webSocket) {
                client.send(JSON.stringify({type: 'info', message: clientNames.get(webSocket) + ' has left the chat'}));
            }
        });
    }); 
});