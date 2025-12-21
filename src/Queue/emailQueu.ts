import { Queue } from "bullmq";
import { ioredis } from "../config/ioRedis";

export const emailQueue = new Queue("email-queue", {
  connection: ioredis,
});
