const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = [];

app.use(express.static(__dirname + '/public'));

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('A new client connected');

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'text') {
        console.log(`Received: ${parsedMessage.content}`);
        broadcast(parsedMessage.content);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('A client disconnected');
    clients.splice(clients.indexOf(ws), 1);
  });
});


function broadcast(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
