import IORedis from "ioredis";
import { logger } from "../util/logger";

export const ioredis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // 🔥 REQUIRED for BullMQ
});

ioredis.on("connect", () => {
  logger.info("🟢 ioredis connected successfully");
});

ioredis.on("error", (err) => {
  logger.error("🔴 ioredis connection error", err);
});
