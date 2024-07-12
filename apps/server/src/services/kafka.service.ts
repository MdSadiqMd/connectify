import { Kafka, Producer } from 'kafkajs';
import config from '../config/server.config';
import fs from 'fs';
import path from 'path';

const kafka = new Kafka({
    brokers: [config.KAFKA_HOST],
    ssl: {
        ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')]
    },
    sasl: {
        username: config.KAFKA_USERNAME,
        password: config.KAFKA_PASSWORD,
        mechanism: "plain",
    }
});

let producer: null | Producer = null;

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
    const producer = await createProducer();
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: 'MESSAGES'
    });
    return true;
}

export default kafka;