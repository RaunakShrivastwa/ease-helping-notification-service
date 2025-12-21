// redisClient.ts
import { createClient } from "redis";
import { logger } from "../util/logger";

const redisClient = createClient({
    url: 'redis://localhost:6379' // Agar local hai toh default yahi rahega
});

redisClient.on('error', (err) => logger.error(`There is error with redis ${err}`));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        logger.info("redis connected")
    }
};

export { redisClient };