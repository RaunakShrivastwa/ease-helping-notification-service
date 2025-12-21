import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "ease-helper-booking-service",
  brokers: ["localhost:9092"]
});
