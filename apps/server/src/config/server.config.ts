import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 8000,
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    KAFKA_HOST: process.env.KAFKA_HOST || '',
    KAFKA_PORT: process.env.KAFKA_PORT || '',
    KAFKA_USERNAME: process.env.KAFKA_USERNAME || '',
    KAFKA_PASSWORD: process.env.KAFKA_PASSWORD || '',
};

export default config;

// https://gist.github.com/piyushgarg-dev/32cadf6420c452b66a9a6d977ade0b01