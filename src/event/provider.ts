import { logger } from "../util/logger";
import { kafka } from "./kafka";

class KafkaProducer {
  private producer :any;

  constructor() {
    this.producer = kafka.producer();
  }

  // Connect to Kafka producer
  async connect() {
    await this.producer.connect();
    logger.info('Kafka producer connected');
  }

  // Publish profile event to Kafka
  async publishProfileEvent(data: any) {
    try {
      await this.producer.send({
        topic: "BOOKING_CREATED",
        messages: [
          {
            key: String(data.id),
            value: JSON.stringify(data),
          },
        ],
      });
    } catch (err) {
      logger.error("Kafka produce failed", err);
    }
  }
}

export default new KafkaProducer();