import { Server } from "socket.io";
import logger from "../config/logger.config";

class SocketService {
    private _io: Server;
    constructor() {
        logger.info(`Socket IO Init`);
        this._io = new Server();
    }

    public initListeners() {
        const io = this.io;
        io.on('connect', (socket) => {
            logger.info(`New Socket Connected`, socket.id);

            socket.on(`event:message`, async ({ message }: { message: string; }) => {
                logger.info(`New Message Received: `, message);
            });
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;