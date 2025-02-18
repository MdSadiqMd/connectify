import { Server } from "socket.io";
import logger from "../config/logger.config";
import { Redis } from "ioredis";
import config from "../config/server.config";
import { produceMessage } from "./kafka.service";

const pub = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    maxRetriesPerRequest: null
});
const sub = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    maxRetriesPerRequest: null
});

class SocketService {
    private _io: Server;

    constructor() {
        logger.info(`Socket IO Init`);
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this.io;
        io.on('connect', (socket) => {
            logger.info(`New Socket Connected: ${socket.id}`);
            socket.on(`event:message`, async ({ message }: { message: string; }) => {
                logger.info(`New Message Received: ${message}`);
                await pub.publish('MESSAGES', JSON.stringify({ message }));
                io.emit('event:message', { message });
            });

            sub.on('message', async (channel, message) => {
                if (channel === 'MESSAGES') {
                    logger.info(`New Message from redis - ${message}`);
                    io.emit("message", message);
                    await produceMessage(message);
                    logger.info(`Message Produced in Kafka - ${message}`);
                }
            });

            socket.on('disconnect', () => {
                logger.info(`Socket Disconnected: ${socket.id}`);
            });
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;