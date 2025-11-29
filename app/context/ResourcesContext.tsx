import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import socketService from "../services/socket";

interface ResourceData {
  id: number;
  name: string;
  category: "food" | "oxygen" | "water" | "spare_parts";
}

interface Resource {
  id: number;
  quantity: number;
  resourceDataId: number;
  resourceData: ResourceData;
  minimumLevel: number;
  criticalLevel: number;
  maximumLevel: number;
  unit: "L" | "kg" | "u";
}

interface ResourcesContextType {
  resources: Resource[];
  loading: boolean;
  isConnected: boolean;
}

const ResourcesContext = createContext<ResourcesContextType>({
  resources: [],
  loading: true,
  isConnected: false,
});

export const useResources = () => {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error("useResources debe usarse dentro de un ResourcesProvider");
  }
  return context;
};

interface ResourcesProviderProps {
  children: React.ReactNode;
}

export const ResourcesProvider: React.FC<ResourcesProviderProps> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) {
      setLoading(true);
      return;
    }

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      if (isConnected && resources.length === 0) {
        console.log("⏱️ Timeout: estableciendo loading a false");
        setLoading(false);
      }
    }, 3000);

    // Escuchar mensaje de bienvenida
    const handleWelcome = (data: { message: string; timestamp: string }) => {
      console.log("👋 Bienvenida del servidor:", data);
    };

    // Escuchar datos iniciales al conectar
    const handleResourcesInitial = (data: { resources: Resource[]; count: number; timestamp: string }) => {
      console.log("📦 Recursos iniciales recibidos:", data);
      console.log("   - Total:", data.count);
      console.log("   - Timestamp:", data.timestamp);
      
      if (data.resources && Array.isArray(data.resources)) {
        setResources(data.resources);
        setLoading(false);
      }
    };

    // Escuchar actualizaciones cada minuto
    const handleConnectionUpdate = (data: { resources: Resource[]; count: number; timestamp: string }) => {
      console.log("🔄 Actualización de recursos:", data);
      console.log("   - Total:", data.count);
      console.log("   - Timestamp:", data.timestamp);
      
      if (data.resources && Array.isArray(data.resources)) {
        setResources(data.resources);
        setLoading(false);
      }
    };

    socketService.onWelcome(handleWelcome);
    socketService.onResourcesInitial(handleResourcesInitial);
    socketService.onConnectionUpdate(handleConnectionUpdate);

    return () => {
      clearTimeout(timeout);
      socketService.off("welcome", handleWelcome);
      socketService.off("resources:initial", handleResourcesInitial);
      socketService.off("connection", handleConnectionUpdate);
    };
  }, [socket, isConnected, resources.length]);

  return (
    <ResourcesContext.Provider value={{ resources, loading, isConnected }}>
      {children}
    </ResourcesContext.Provider>
  );
};

export default ResourcesContext;
