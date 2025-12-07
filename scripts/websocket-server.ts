// scripts/websocket-server.ts
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import url from 'url';

const wss = new WebSocketServer({ port: 3001 });

console.log('WebSocket server started on port 3001');

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcast(message: string) {
    console.log(`Broadcasting message to all clients: ${message}`);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Create a simple HTTP server to listen for broadcast triggers
const triggerServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url || '', true);
    if (req.method === 'POST' && parsedUrl.pathname === '/broadcast') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);
                if (message) {
                    broadcast(message);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Broadcasted successfully' }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Message not provided' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Not Found' }));
    }
});

triggerServer.listen(8081, () => {
    console.log('HTTP trigger server listening on port 8081');
});
