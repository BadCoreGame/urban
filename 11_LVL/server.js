const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

//connect client
wss.on('connection', (ws) => {
    console.log(`Client connected`);
    ws.send(JSON.stringify({mode: "message", info: {userName: "SeRvEr", message: "Welcome"}}));
    
    //send message
    ws.on('message', (message) => {
        console.log(`Received message ${message}`);
        const json = JSON.parse(message);
        switch (json.mode) {
            case 'send-message': {
                json.mode = "message"
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(json));
                    }
                });
            }; break;
            default: console.log('Unknown mode server');
        }
    });

    //close client
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server started on localhost:8080');