import { Server } from 'socket.io';

import MessageModel from './models/message.model.js';

let io;

export const init = ( httpServer ) => {
    io = new Server( httpServer );

    io.on('connection', async ( socketClient ) => {
        console.log(`New socket client connected ${socketClient.id}`);
        const messages = await MessageModel.find({});
        socketClient.emit('update-messages', messages);

        socketClient.on('new-message', async (msg) => {
            await MessageModel.create(msg);
            const messages = await MessageModel.find({});
            io.emit('update-messages', messages);
        });
    });
}

export const emit = (event, data) => {
    io.emit(event, data)
}