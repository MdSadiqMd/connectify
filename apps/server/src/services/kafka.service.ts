import { Kafka, Producer, logLevel } from 'kafkajs';
import fs from 'fs';
import path from 'path';

import config from '../config/server.config';
import logger from '../config/logger.config';
import prismaClient from './prisma.service';

const kafka = new Kafka({
    brokers: [config.KAFKA_HOST],
    ssl: {
        ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')]
    },
    sasl: {
        username: config.KAFKA_USERNAME,
        password: config.KAFKA_PASSWORD,
        mechanism: "plain",
    },
    logLevel: logLevel.ERROR,
});

let producer: Producer | null = null;

export async function createProducer() {
    if (producer) {
        return producer;
    }
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string) {
    try {
        const producer = await createProducer();
        await producer.send({
            messages: [{ key: `message-${Date.now()}`, value: message }],
            topic: 'MESSAGES'
        });
        return true;
    } catch (error) {
        logger.error(`Failed to produce message: ${error.message}`);
        producer = null;
        return false;
    }
}

export async function startConsumer() {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            if (!message.value) return;
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value.toString()
                    }
                });
            } catch (error) {
                logger.error(`Error in saving message in DB: ${error.message}`);
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: 'MESSAGES' }]);
                }, 60 * 1000);
            }
        }
    });
}

export default kafka;