import { Server } from 'socket.io';

import MessageModel from './dao/models/message.model.js';
import { authMiddleware, authRole } from './utils/utils.js';
import { logger } from './config/logger.js';

let io;

export const init = ( httpServer ) => {
    io = new Server( httpServer );

    io.on('connection', async ( socketClient ) => {
        logger.info(`New socket client connected ${socketClient.id}`);
        const messages = await MessageModel.find({});
        socketClient.emit('update-messages', messages);

        socketClient.on('new-message', authMiddleware('jwt'), authRole(['user']), async (msg) => {
            await MessageModel.create(msg);
            const messages = await MessageModel.find({});
            io.emit('update-messages', messages);
        });
    });
}

export const emit = (event, data) => {
    io.emit(event, data)
}