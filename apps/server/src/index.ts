import http from 'http';
import SocketService from './services/socket.service';
import logger from './config/logger.config';

async function init() {
    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    const socketService = new SocketService();
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        logger.info(`Server Started at ${PORT}`);
    });

    socketService.initListeners();
}

init();