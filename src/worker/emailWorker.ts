import { Worker } from "bullmq";
import { ioredis } from "../config/ioRedis";
import { sendBookingMail } from "../service/emailService";
import { logger } from "../util/logger";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, booking } = job.data;
    await sendBookingMail(to, booking);
    logger.info(`📧 Email sent to ${to}`);
  },
  {
    connection: ioredis,
    concurrency: 10,
  }
);

emailWorker.on("failed", (job, err) => {
  logger.error(`❌ Email failed ${job?.id}`, err);
});
