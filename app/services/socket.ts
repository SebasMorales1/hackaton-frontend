import { io, Socket } from "socket.io-client";
import config from "../config/app.config";

// URL del backend desde configuración
const SOCKET_URL = config.SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, config.SOCKET_CONFIG);

      this.socket.on("connect", () => {
        console.log("✅ Socket conectado:", this.socket?.id);
        console.log("🌐 URL:", SOCKET_URL);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Socket desconectado:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Error de conexión:", error.message);
        console.error("🌐 Intentando conectar a:", SOCKET_URL);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket desconectado manualmente");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Eventos para recursos - coinciden con el backend
  onWelcome(callback: (data: { message: string; timestamp: string }) => void): void {
    this.socket?.on("welcome", callback);
  }

  onResourcesInitial(callback: (data: { resources: any[]; count: number; timestamp: string }) => void): void {
    this.socket?.on("resources:initial", callback);
  }

  onConnectionUpdate(callback: (data: { resources: any[]; count: number; timestamp: string }) => void): void {
    this.socket?.on("connection", callback);
  }

  // Método legado mantenido por compatibilidad
  onResourcesUpdate(callback: (data: any) => void): void {
    this.socket?.on("resources:initial", callback);
    this.socket?.on("connection", callback);
  }

  // Limpiar listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
export default socketService;
