import type { Route } from "./+types/home"
import styles from "../css/Home.module.css"
import Resource from "../components/Resource"
import SocketDebugger from "../components/SocketDebugger"
import { Link } from "react-router"
import { useResources } from "../hooks/useResources"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitoreo de recursos" },
    { name: "description", content: "Monitoreo de recursos de la colonia" },
  ];
}

export default function Home() {
  const { resources, loading, isConnected } = useResources();

  return (
    <div className="container">
      <SocketDebugger />
      <div className={styles.contain}>
        <h1 className={styles.title}>
          <span>Monitoreo</span> de recursos
          {isConnected ? " 🟢" : " 🔴"}
        </h1>

        <div className={styles.btn_actions}>
          <Link className={styles.btn} to="/gestionar">Gestionar recursos</Link>
          <button className={styles.btn} disabled>
            Actualizaciones automáticas cada minuto
          </button>
        </div>

        <section className={styles.resources}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              Cargando recursos desde el servidor...
            </p>
          ) : resources.length > 0 ? (
            resources
              .filter((resource: any) => resource.resourceData && resource.resourceData.name)
              .map((resource: any) => (
                <Resource
                  key={resource.id}
                  id={resource.id}
                  name={resource.resourceData.name}
                  critical_lvl={resource.criticalLevel}
                  quantity={resource.quantity}
                  unit={resource.unit}
                  date={new Date().toLocaleDateString()}
                />
              ))
          ) : (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              {isConnected 
                ? "No hay recursos disponibles en el servidor." 
                : "Conectando al servidor en localhost:3001..."
              }
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
