import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket/socket";// Socket file import karein
import { startBookingConsumer } from "./event/consumer";
import { logger } from "./util/logger";
import { ioredis } from "./config/ioRedis";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket initialize karein
initSocket(server);

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(PORT, () => {
  logger.info(`Server running http://localhost:${PORT}`)
  startOperation();
});

async function startOperation(){
  await ioredis.ping();
    await startBookingConsumer();

}