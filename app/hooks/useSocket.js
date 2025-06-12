import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://cent-stage.duckdns.org", {
      path: '/messages/socket.io',
      transports: ["websocket"], // use 'websocket' if supported
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
}
