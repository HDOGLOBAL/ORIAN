// lib/socketio.js
import { Server } from "socket.io";

let io = null;
const activeSupports = new Map();

export function initializeSocket(server) {
  if (io) return io;

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_DOMAIN || "*",
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // Socket.io connection handler
  io.on("connection", (socket) => {
    console.log(" Socket.IO Connected:", socket.id);

    // সাপোর্ট লগইন করলে
    socket.on("registerSupport", (data) => {
      const { username, avatar } = data;
      activeSupports.set(socket.id, { username, avatar });
      console.log("🎧 Support joined:", socket.id);
    });

    // join room by conversationID
    socket.on("joinConversation", (conversationID) => {
      socket.join(conversationID);
      console.log(`📡 ${socket.id} joined room ${conversationID}`);
    });

    // receive new message
    socket.on("send-message", async (data) => {
      const { conversationID, message } = data;
      console.log(`📨 Message to ${conversationID}:`, message);

      if (activeSupports.size > 0) {
        const firstSupport = Array.from(activeSupports.values())[0];
        io.to(conversationID).emit("receive-message", {
          message,
          support: firstSupport,
        });
      } else {
        io.to(socket.id).emit("no-support-online", {
          message:
            "There are currently no support agents online. Please try again later.",
        });
      }
    });

    // receive new message Notification
    socket.on("send-notification", (data) => {
      io.emit("new-message-notification", data);
    });

    socket.on("disconnect", () => {
      if (activeSupports.has(socket.id)) {
        activeSupports.delete(socket.id);
        console.log("❌ Support left:", socket.id);
      }
      console.log("❌ Socket.IO disconnected:", socket.id);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Connection error handling
  io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
  });

  return io;
}

export function getIO() {
  if (!io) {
    console.warn("Socket.io not initialized yet");
  }
  return io;
}

export function getActiveSupports() {
  return activeSupports;
}
