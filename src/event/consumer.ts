import { kafka } from "./kafka";
import { logger } from "../util/logger";
import { ioredis } from "../config/ioRedis";
import { emailQueue } from "../Queue/emailQueu";

const consumer = kafka.consumer({
  groupId: "notification-group",
});

export async function startBookingConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "BOOKING_CREATED",
    fromBeginning: false,
  });

  logger.info("📥 BOOKING_CREATED consumer started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;

        const booking = JSON.parse(message.value.toString());
        const { location } = booking;

        const providers = await ioredis.hgetall("online_providers");

        for (const userId in providers) {
          const provider = JSON.parse(providers[userId]);

          if (provider.location === location) {

            // ✅ UNIQUE & SAFE jobId
            const jobId = `booking_${booking.id}_provider_${provider.id}`;

            await emailQueue.add(
              "send-booking-email",
              {
                to: provider.email,
                booking,
              },
              {
                jobId,                 // 🔥 DUPLICATE STOP
                attempts: 3,
                backoff: {
                  type: "exponential",
                  delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: false,
              }
            );
          }
        }
      } catch (err) {
        logger.error("❌ Booking consume error", err);
      }
    },
  });
}
