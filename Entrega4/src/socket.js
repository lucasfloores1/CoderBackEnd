import { Server } from 'socket.io';

let socketServer;

export const init = ( httpServer ) => {
    socketServer = new Server( httpServer );

    socketServer.on('connection', ( socketClient ) => {
        console.log(`New socket client connected ${socketClient.id}`);
    });
}

export const emit = (event, data) => {
    socketServer.emit(event, data)
}