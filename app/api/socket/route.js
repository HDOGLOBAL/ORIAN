// app/api/socket/route.js
import { initializeSocket, getIO } from "@/lib/socketio";

export async function GET(req) {
  const io = getIO();
  
  if (!io) {
    return new Response(
      JSON.stringify({ error: "Socket.io not initialized" }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Socket.io server is running",
      socketConnected: true,
    }),
    { status: 200 }
  );
}
