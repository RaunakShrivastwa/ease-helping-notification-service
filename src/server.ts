import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket/socket";
import { startBookingConsumer } from "./event/consumer";
import { logger } from "./util/logger";
import { ioredis } from "./config/ioRedis";

import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "./Queue/emailQueu";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket init
initSocket(server);


// ✅ Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(PORT, () => {
  logger.info(`Server running http://localhost:${PORT}`);
  startOperation();
});

async function startOperation() {
  await ioredis.ping();
  await startBookingConsumer(); // worker start
}
