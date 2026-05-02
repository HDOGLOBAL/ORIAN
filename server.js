// server.js - Socket.io সহ Next.js Server
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { parse } = require("url");

// Environment configuration
const dev = process.env.NODE_ENV !== "production";
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

const app = next({ dev, HOST, PORT });
const handle = app.getRequestHandler();



app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Socket.IO handles /api/socket requests via its own middleware
    // We just handle other requests through Next.js
    if (!pathname.startsWith("/api/socket")) {
      handle(req, res, parsedUrl);
    }
  });

  // 🔌 Socket.io setup
  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_DOMAIN || "*",
      credentials: true,
      methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  console.log("🔧 Socket.IO configured with CORS:", {
    origin: process.env.NEXT_PUBLIC_DOMAIN || "*",
    credentials: true,
    path: "/api/socket"
  });


  // 🧑‍💻 Active supports management
  const activeSupports = new Map();

  io.on("connection", (socket) => {
    console.log("✅ Socket.IO Connected:", socket.id);
    // send current support status to newly connected client (accurate, not a default)
    try {
      const firstSupport = activeSupports.size > 0 ? Array.from(activeSupports.values())[0] : null;
      console.log("[server] emitting initial support-status -> online:", activeSupports.size > 0);
      socket.emit("support-status", { online: activeSupports.size > 0, support: firstSupport });
    } catch (err) {
      console.error("Error emitting support-status:", err);
    }
    // Only register support if admin explicitly connects (via registerSupport event)

    // Register support agent (can override default)
    socket.on("registerSupport", (data) => {
      const { username, avatar } = data;
      activeSupports.set(socket.id, { username, avatar });
      console.log("🎧 Support registered:", socket.id, {username, avatar});
      // Notify clients that support is available
      io.emit("support-online", { username, avatar });
      // also send a status object for clients that request initial status
      io.emit("support-status", { online: true, support: { username, avatar } });
    });

    // Join conversation room
    socket.on("joinConversation", (conversationID) => {
      socket.join(conversationID);
      console.log(`📡 ${socket.id} joined room ${conversationID}`);
    });

    // Leave conversation room
    socket.on("leaveConversation", (conversationID) => {
      socket.leave(conversationID);
      console.log(`📡 ${socket.id} left room ${conversationID}`);
    });

    // Handle new message
    socket.on("send-message", (data) => {
      const { conversationID, message, content, message_id, sender_id, createdAt, status } = data;
      console.log(`📨 Message to ${conversationID}:`, data);

      if (activeSupports.size > 0) {
        const firstSupport = Array.from(activeSupports.values())[0];
        // Broadcast the complete message data to all users in the conversation room
        io.to(conversationID).emit("receive-message", {
          message: data,  // Send the entire message object
          support: firstSupport,
        });
        console.log(`✅ Message broadcasted to room ${conversationID}`);
      } else {
        io.to(socket.id).emit("no-support-online", {
          message:
            "There are currently no support agents online. Please try again later.",
        });
        console.log(`⚠️ No support agents online for room ${conversationID}`);
      }
    });

    // Send notification to all users
    socket.on("send-notification", (data) => {
      io.emit("new-message-notification", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (activeSupports.has(socket.id)) {
        activeSupports.delete(socket.id);
        console.log("❌ Support left:", socket.id);
        // If no supports remain, notify clients
        if (activeSupports.size === 0) {
            io.emit("support-offline");
            io.emit("support-status", { online: false, support: null });
        }
      }
      console.log("❌ Socket.IO disconnected:", socket.id);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Global io reference for API routes
  global._io = io; 

  // 🚀 Start server
  server.listen(PORT, HOST, (err) => {
    if (err) throw err;
    console.log(
      `🚀 Server ready on http://${HOST}:${PORT} (${dev ? "dev" : "production"})`
    );
    console.log(`📡 Socket.IO path: /api/socket`);
  });
});