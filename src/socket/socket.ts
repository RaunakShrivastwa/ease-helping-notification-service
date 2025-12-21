import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ioredis } from "../config/ioRedis";
import { logger } from "../util/logger";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`🔌 new provider connected ${socket.id}`);

    socket.on("message", async (data: any) => {
      try {
        if (data.type === "LOGIN_SUCCESS") {
          const userObj = data.user.user || data.user;
          const userId = String(userObj.id);

          // 🔥 STORE USERID ON SOCKET ITSELF
          socket.data.userId = userId;

          await ioredis.hset(
            "online_providers",
            userId,
            JSON.stringify({
              ...userObj,
              socketId: socket.id,
              onlineAt: new Date().toISOString(),
            })
          );

          socket.join(`user_${userId}`);
          logger.info(`👤 Provider ${userId} online & saved in Redis`);
        }
      } catch (err) {
        logger.error("❌ socket message error", err);
      }
    });

    socket.on("disconnect", async (reason) => {
      const userId = socket.data.userId;

      logger.info(`❌ socket disconnected ${socket.id} | reason: ${reason}`);

      if (!userId) {
        logger.warn("⚠️ userId missing on disconnect, skipping redis delete");
        return;
      }

      try {
        await ioredis.hdel("online_providers", userId);
        logger.info(`🗑️ Provider ${userId} removed from Redis`);
      } catch (err) {
        logger.error("❌ Redis delete failed", err);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
