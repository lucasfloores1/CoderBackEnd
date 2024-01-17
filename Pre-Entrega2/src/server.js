import http from 'http';
import app from './app.js';
import { init as initSocket } from './socket.js';
import { init } from './db/mongodb.js';
import config from './config/config.js';

await init();

const server = http.createServer(app);
const PORT = config.port;

//socket server
initSocket(server);

//HTTP server
server.listen(PORT, (req, res) => {
    console.log(`Server Running into hhtp://localhost:${PORT}`);
});
