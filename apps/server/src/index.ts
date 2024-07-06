import http from 'http';

import SocketService from './services/socket.service';
import logger from './config/logger.config';
import config from './config/server.config';

async function init() {
    const httpServer = http.createServer();

    const socketService = new SocketService();
    socketService.io.attach(httpServer);

    httpServer.listen(config.PORT, () => {
        logger.info(`Server Started at ${config.PORT}`);
    });

    socketService.initListeners();
}

init();