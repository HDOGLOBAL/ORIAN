"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SupportStatusContext = createContext({
  isSupportOnline: false,
  setSupportOnline: () => {},
});

export function SupportStatusProvider({ children }) {
  const [isSupportOnline, setSupportOnline] = useState(false);

  useEffect(() => {
    // Presence socket: lightweight connection that only listens for support presence events.
    if (typeof window === "undefined") return;

    const socketUrl = window.location.origin;
    const presenceSocket = io(socketUrl, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    presenceSocket.on("connect", () => {
      // console.debug("[presence] connected", presenceSocket.id);
    });

    presenceSocket.on("support-status", (data) => {
      const online = !!data?.online;
      setSupportOnline(online);
    });

    presenceSocket.on("support-online", () => setSupportOnline(true));
    presenceSocket.on("support-offline", () => setSupportOnline(false));

    presenceSocket.on("disconnect", () => {
      setSupportOnline(false);
    });

    return () => {
      presenceSocket.disconnect();
    };
  }, []);

  return (
    <SupportStatusContext.Provider value={{ isSupportOnline, setSupportOnline }}>
      {children}
    </SupportStatusContext.Provider>
  );
}

export function useSupportStatus() {
  return useContext(SupportStatusContext);
}
