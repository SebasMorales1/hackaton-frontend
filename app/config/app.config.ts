// Configuración centralizada de la aplicación

export const config = {
  // URL del backend
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:3001",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  
  // Configuración de Socket.IO
  SOCKET_CONFIG: {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000,
  },
  
  // Colores por categoría
  CATEGORY_COLORS: {
    oxygen: "#4a9eff",
    water: "#00bcd4",
    food: "#4caf50",
    spare_parts: "#ff9800"
  },
  
  // Nombres traducidos
  CATEGORY_NAMES: {
    oxygen: "Oxígeno",
    water: "Agua",
    food: "Comida",
    spare_parts: "Repuestos"
  },
  
  // Configuración de actualización
  UPDATE_INTERVAL: 60000, // 1 minuto
};

export default config;
