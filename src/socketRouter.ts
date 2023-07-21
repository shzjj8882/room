import http from 'http';
import {Server as SocketIO} from 'socket.io';
import { logger } from './utils';
import { CacheClass} from 'memory-cache'
export default (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,store:CacheClass<string,any>) => {
  const io = new SocketIO(server, {
    transports: ["websocket", "polling"],
    cors: {
      allowedHeaders: ["Content-Type", "Authorization"],
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
    allowEIO3: true,
  });

  // socket-connection
  io.on("connection", (socket) => {
    logger.ioDebug("connection established!");
    io.to(`${socket.id}`).emit("init-room");


    socket.on("join-room", async (roomID) => {
      logger.socketDebug(`${socket.id} has joined ${roomID}`);
      await socket.join(roomID);
      const sockets = await io.in(roomID).fetchSockets();
      if (sockets.length <= 1) {
        io.to(`${socket.id}`).emit("first-in-room");
      } else {
        logger.socketDebug(`${socket.id} new-user emitted to room ${roomID}`);
        socket.broadcast.to(roomID).emit("new-user", socket.id);
      }
      io.to(`${socket.id}`).emit('replay',store.get(roomID));
      io.in(roomID).emit(
        "room-user-change",
        sockets.map((socket) => socket.id),
      );
    });

    socket.on(
      "server-broadcast",
      (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array) => {
        store.put(roomID,encryptedData);
        logger.socketDebug(`${socket.id} sends update to ${roomID}`);
        socket.broadcast.to(roomID).emit("client-broadcast", encryptedData, iv);
      },
    );

    socket.on(
      "server-volatile-broadcast",
      (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array) => {
        logger.socketDebug(`${socket.id} sends volatile update to ${roomID}`);
        socket.volatile.broadcast
          .to(roomID)
          .emit("client-broadcast", encryptedData, iv);
      },
    );

    // disconnecting
    socket.on("disconnecting", async () => {
      logger.socketDebug(`${socket.id} has disconnected`);
      for (const roomID in socket.rooms) {
        const otherClients = (await io.in(roomID).fetchSockets()).filter(
          (_socket) => _socket.id !== socket.id,
        );

        if (otherClients.length > 0) {
          socket.broadcast.to(roomID).emit(
            "room-user-change",
            otherClients.map((socket) => socket.id),
          );
        }
      }
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
      socket.disconnect();
    });
  })
}
