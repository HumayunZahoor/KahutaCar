import { Server } from "socket.io";

export const initializeWebSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("updateLocation", (data) => {
      io.emit("locationUpdate", data); 
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("WebSocket Server Initialized");
};
