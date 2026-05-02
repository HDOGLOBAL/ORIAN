"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function SocketPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket = io({
      path: "/api/socket",
    });

    socket.on("connect", () => console.log("🟢 connected", socket.id));
    socket.on("receive-message", (msg) => setChat((p) => [...p, msg]));

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">💬 Socket.io + Next.js (same port)</h1>
      <div className="border p-3 h-60 overflow-y-auto bg-gray-50 rounded mb-3">
        {chat.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button
          className="bg-blue-500 text-white px-3 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
