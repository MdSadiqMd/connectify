import http from 'http';

import SocketService from './services/socket.service';
import logger from './config/logger.config';
import config from './config/server.config';
import { startConsumer } from './services/kafka.service';

async function init() {
    startConsumer();
    const httpServer = http.createServer();

    const socketService = new SocketService();
    socketService.io.attach(httpServer);

    httpServer.listen(config.PORT, () => {
        logger.info(`Server Started at ${config.PORT}`);
    });

    socketService.initListeners();
}

init();