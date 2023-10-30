import http from 'http';
import app from './app.js';
import { init } from './socket.js';

const server = http.createServer(app);
const PORT = 8080;

//HTTP server
server.listen(PORT, (req, res) => {
    console.log(`Server Running into hhtp://localhost:${PORT}`);
});

//socket server
const io = init(server);