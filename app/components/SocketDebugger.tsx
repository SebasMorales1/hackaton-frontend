import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";

export default function SocketDebugger() {
  const { socket, isConnected } = useSocket();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
    };

    socket.onAny((eventName, ...args) => {
      addLog(`📥 Recibido: ${eventName} - ${JSON.stringify(args)}`);
    });

    const originalEmit = socket.emit;
    socket.emit = function (eventName: string, ...args: any[]) {
      addLog(`📤 Enviado: ${eventName} - ${JSON.stringify(args)}`);
      return originalEmit.apply(socket, [eventName, ...args]);
    };

    return () => {
      socket.offAny();
    };
  }, [socket]);

  if (!socket) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "10px",
      right: "10px",
      width: "400px",
      maxHeight: "300px",
      overflow: "auto",
      background: "#1e1e1e",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontFamily: "monospace",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: 9999
    }}>
      <div style={{ marginBottom: "10px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Socket.IO Debugger {isConnected ? "🟢" : "🔴"}</span>
        <span style={{ fontSize: "10px" }}>ID: {socket.id}</span>
      </div>
      <div style={{ fontSize: "10px", opacity: 0.7 }}>
        {logs.length === 0 ? "Esperando eventos..." : logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "4px", borderBottom: "1px solid #333", paddingBottom: "4px" }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
