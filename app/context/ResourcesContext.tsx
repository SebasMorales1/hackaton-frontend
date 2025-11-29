import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useSocket } from "./SocketContext";
import socketService from "../services/socket";
import type { Resource } from "../types/resource.types";

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

export function useResources() {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error("useResources debe usarse dentro de un ResourcesProvider");
  }
  return context;
}

interface ResourcesProviderProps {
  children: React.ReactNode;
}

function ResourcesProviderComponent({ children }: ResourcesProviderProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  // Usar useCallback para estabilizar los handlers
  const handleWelcome = useCallback((data: { message: string; timestamp: string }) => {
    // Silencioso para evitar ruido en consola
  }, []);

  const handleResourcesInitial = useCallback((data: { resources: Resource[]; count: number; timestamp: string }) => {
    if (data.resources && Array.isArray(data.resources)) {
      console.log("📦 Datos recibidos:", data.resources.length, "recursos");
      console.log("📦 Primer recurso:", JSON.stringify(data.resources[0], null, 2));
      
      const validResources = data.resources.filter(r => 
        r && r.resourceData && r.resourceData.name && r.quantity !== undefined
      );
      
      console.log("✅ Recursos válidos después del filtro:", validResources.length);
      
      if (validResources.length > 0) {
        console.log("📦 Recursos iniciales cargados:", validResources.length);
        console.log("📦 Ejemplo:", validResources[0].resourceData.name);
      } else {
        console.error("❌ Todos los recursos fueron filtrados!");
        console.log("❌ Estructura del primer recurso:", data.resources[0]);
      }
      
      setResources(validResources);
      setLoading(false);
    }
  }, []);

  const handleConnectionUpdate = useCallback((data: { resources: Resource[]; count: number; timestamp: string }) => {
    console.log("🔄 Actualización recibida del servidor");
    
    if (!data.resources || !Array.isArray(data.resources)) {
      console.warn("⚠️ Datos inválidos en actualización");
      return;
    }
    
    console.log("🔄 Recursos en actualización:", data.resources.length);
    
    const validResources = data.resources.filter(r => 
      r && r.resourceData && r.resourceData.name && r.quantity !== undefined
    );
    
    console.log("🔄 Recursos válidos en actualización:", validResources.length);
    
    setResources(prevResources => {
      if (prevResources.length === 0) {
        console.log("   ✅ Primera carga desde actualización");
        return validResources;
      }
      
      if (prevResources.length !== validResources.length) {
        console.log("   ✅ Cantidad cambió:", prevResources.length, "→", validResources.length);
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
        console.log("   ✅ Cambios detectados, actualizando recursos");
        return validResources;
      }
      
      console.log("   ⏭️ Sin cambios reales, manteniendo estado");
      return prevResources;
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
}

// IMPORTANTE: Exportar como constante para React Fast Refresh
export const ResourcesProvider = ResourcesProviderComponent;
