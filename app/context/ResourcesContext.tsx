import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
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

  // Usar useCallback para estabilizar los handlers
  const handleWelcome = useCallback((data: { message: string; timestamp: string }) => {
    // Silencioso para evitar ruido en consola
  }, []);

  const handleResourcesInitial = useCallback((data: { resources: Resource[]; count: number; timestamp: string }) => {
    if (data.resources && Array.isArray(data.resources)) {
      const validResources = data.resources.filter(r => 
        r && r.resourceData && r.resourceData.name && r.quantity !== undefined
      );
      
      if (validResources.length > 0) {
        console.log("📦 Recursos iniciales:", validResources.length);
      }
      
      setResources(validResources);
      setLoading(false);
    }
  }, []);

  const handleConnectionUpdate = useCallback((data: { resources: Resource[]; count: number; timestamp: string }) => {
    if (!data.resources || !Array.isArray(data.resources)) return;
    
    const validResources = data.resources.filter(r => 
      r && r.resourceData && r.resourceData.name && r.quantity !== undefined
    );
    
    setResources(prevResources => {
      if (prevResources.length === 0) return validResources;
      if (prevResources.length !== validResources.length) {
        console.log("🔄 Cambios detectados");
        return validResources;
      }
      
      let hasChanges = false;
      for (const newRes of validResources) {
        const oldRes = prevResources.find(r => r.id === newRes.id);
        if (!oldRes || 
            oldRes.quantity !== newRes.quantity ||
            oldRes.resourceData?.name !== newRes.resourceData?.name ||
            oldRes.resourceData?.category !== newRes.resourceData?.category) {
          hasChanges = true;
          break;
        }
      }
      
      if (hasChanges) {
        console.log("🔄 Cambios detectados");
      }
      
      return hasChanges ? validResources : prevResources;
    });
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) {
      setLoading(true);
      return;
    }

    const timeout = setTimeout(() => setLoading(false), 3000);

    socketService.onWelcome(handleWelcome);
    socketService.onResourcesInitial(handleResourcesInitial);
    socketService.onConnectionUpdate(handleConnectionUpdate);

    return () => {
      clearTimeout(timeout);
      socketService.off("welcome", handleWelcome);
      socketService.off("resources:initial", handleResourcesInitial);
      socketService.off("connection", handleConnectionUpdate);
    };
  }, [socket, isConnected, handleWelcome, handleResourcesInitial, handleConnectionUpdate]);

  // Memorizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(
    () => ({ resources, loading, isConnected }),
    [resources, loading, isConnected]
  );

  return (
    <ResourcesContext.Provider value={contextValue}>
      {children}
    </ResourcesContext.Provider>
  );
};

// Solo exportar el hook y el provider, no el contexto directamente
// Esto ayuda a React Fast Refresh
