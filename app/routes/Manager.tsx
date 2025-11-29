import type { Route } from "./+types/home"
import { Link } from "react-router"
import homeStyles from "../css/Home.module.css"
import resourceStyles from "../css/Resource.module.css"
import { useResources } from "../hooks/useResources"
import { useState } from "react"
import config from "../config/app.config"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestionar" },
    { name: "description", content: "Gestión de recursos de la colonia" },
  ];
}

export default function Manager() {
    const { resources, loading, isConnected } = useResources();
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [newQuantity, setNewQuantity] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdateQuantity = async (resourceId: number, quantity: number) => {
        setIsUpdating(true);
        setMessage("");
        
        try {
            const response = await fetch(`${config.API_URL}/resources/${resourceId}/update-quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                setMessage("✅ Cantidad actualizada exitosamente");
                setSelectedResource(null);
                setNewQuantity("");
                setTimeout(() => setMessage(""), 3000);
            } else {
                const error = await response.json();
                setMessage(`❌ Error: ${error.message || 'No se pudo actualizar'}`);
            }
        } catch (error) {
            setMessage("❌ Error de conexión con el servidor");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getCriticalResources = () => {
        return resources.filter((r: any) => r.quantity <= r.criticalLevel);
    };

    const getCategoryColor = (category: string) => {
        return config.CATEGORY_COLORS[category as keyof typeof config.CATEGORY_COLORS] || "#666";
    };

    const getCategoryName = (category: string) => {
        return config.CATEGORY_NAMES[category as keyof typeof config.CATEGORY_NAMES] || category;
    };

    return (
        <div className="container">
            <div className={homeStyles.contain}>
                <h1 className={homeStyles.title}>
                    <span>Gestionar</span> recursos {isConnected ? "🟢" : "🔴"}
                </h1>

                <div className={homeStyles.btn_actions}>
                    <Link className={homeStyles.btn} to="/">← Volver al monitoreo</Link>
                </div>

                {message && (
                    <div style={{ 
                        padding: "15px", 
                        marginTop: "2em",
                        marginBottom: "2em",
                        background: message.includes("✅") ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                        border: `1px solid ${message.includes("✅") ? "#4caf50" : "#f44336"}`,
                        color: message.includes("✅") ? "#4caf50" : "#f44336",
                        textAlign: "center",
                        fontSize: "1.1em"
                    }}>
                        {message}
                    </div>
                )}

                {/* Alertas críticas */}
                {getCriticalResources().length > 0 && (
                    <div style={{ 
                        background: "rgba(219, 29, 34, 0.2)",
                        border: "2px solid var(--p-color)",
                        color: "white", 
                        padding: "20px", 
                        marginTop: "3em",
                        marginBottom: "2em",
                        boxShadow: "0 1px 100px rgba(219, 29, 34, 0.3)"
                    }}>
                        <h2 style={{ 
                            margin: "0 0 15px 0", 
                            fontSize: "1.5rem",
                            fontFamily: '"Boldonse", system-ui',
                            color: "var(--p-color)",
                            textAlign: "center"
                        }}>
                            ⚠️ Recursos en nivel crítico ({getCriticalResources().length})
                        </h2>
                        <div style={{ display: "grid", gap: "10px" }}>
                            {getCriticalResources().map((resource: any) => (
                                <div key={resource.id} style={{ 
                                    background: "rgba(0, 0, 0, 0.5)", 
                                    padding: "15px",
                                    border: "1px solid var(--p-color)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <span style={{ fontWeight: "bold", color: "var(--s-color)" }}>
                                        {resource.resourceData.name}
                                    </span>
                                    <span>
                                        {resource.quantity} {resource.unit} / {resource.criticalLevel} {resource.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <p style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem" }}>
                        Cargando recursos...
                    </p>
                ) : (
                    <section className={homeStyles.resources}>
                        {resources
                            .filter((resource: any) => resource.resourceData && resource.resourceData.name)
                            .map((resource: any) => {
                                const isCritical = resource.quantity <= resource.criticalLevel;
                            
                                return (
                                    <article 
                                        key={resource.id}
                                        className={`${resourceStyles.contain} ${isCritical ? resourceStyles.low : ""}`}
                                        onClick={() => setSelectedResource(resource)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div style={{ 
                                            display: "inline-block",
                                            padding: "3px 8px",
                                            background: getCategoryColor(resource.resourceData.category),
                                            color: "white",
                                            fontSize: "0.7em",
                                            marginBottom: "5px",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>
                                            {getCategoryName(resource.resourceData.category)}
                                        </div>
                                    
                                    <h3 className={resourceStyles.name}>
                                        {resource.resourceData.name}
                                    </h3>
                                    
                                    <p className={resourceStyles.quantity}>
                                        {resource.quantity} <span>{resource.unit}</span>
                                    </p>
                                    
                                    <div style={{ fontSize: "0.8em", color: "#999", textAlign: "center", marginTop: "0.5em" }}>
                                        <div>Min: {resource.minimumLevel}</div>
                                        <div>Crítico: {resource.criticalLevel}</div>
                                        <div>Máx: {resource.maximumLevel}</div>
                                    </div>
                                    
                                    <div className={resourceStyles.btn_container}>
                                        <button 
                                            className={resourceStyles.btn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedResource(resource);
                                            }}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                    
                                    {isCritical && (
                                        <div style={{ 
                                            marginTop: "10px", 
                                            padding: "5px", 
                                            background: "var(--p-color)", 
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: "0.8em",
                                            textAlign: "center"
                                        }}>
                                            ⚠️ CRÍTICO
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </section>
                )}

                {/* Modal para actualizar cantidad */}
                {selectedResource && (
                    <div className={resourceStyles.modal} onClick={() => setSelectedResource(null)}>
                        <div 
                            className={resourceStyles.modal__content}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={resourceStyles.btn_close} onClick={() => setSelectedResource(null)}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="container" style={{ paddingTop: "3em" }}>
                                <h2 style={{ 
                                    fontFamily: '"Boldonse", system-ui',
                                    textAlign: "center",
                                    marginBottom: "1em",
                                    fontSize: "2em"
                                }}>
                                    Actualizar <span style={{ color: "var(--p-color)" }}>cantidad</span>
                                </h2>
                                
                                <h3 style={{ 
                                    color: "var(--s-color)", 
                                    textAlign: "center",
                                    marginBottom: "2em",
                                    fontSize: "1.5em"
                                }}>
                                    {selectedResource.resourceData.name}
                                </h3>
                                
                                <div style={{ 
                                    margin: "2em 0",
                                    padding: "2em",
                                    background: "rgba(0, 0, 0, 0.5)",
                                    border: "1px solid white"
                                }}>
                                    <div style={{ marginBottom: "15px", fontSize: "1.1em" }}>
                                        <strong style={{ color: "var(--s-color)" }}>Cantidad actual:</strong> {selectedResource.quantity} {selectedResource.unit}
                                    </div>
                                    <div style={{ marginBottom: "15px", fontSize: "1.1em" }}>
                                        <strong style={{ color: "var(--s-color)" }}>Nivel mínimo:</strong> {selectedResource.minimumLevel} {selectedResource.unit}
                                    </div>
                                    <div style={{ marginBottom: "15px", fontSize: "1.1em" }}>
                                        <strong style={{ color: "var(--s-color)" }}>Nivel crítico:</strong> {selectedResource.criticalLevel} {selectedResource.unit}
                                    </div>
                                    <div style={{ fontSize: "1.1em" }}>
                                        <strong style={{ color: "var(--s-color)" }}>Nivel máximo:</strong> {selectedResource.maximumLevel} {selectedResource.unit}
                                    </div>
                                </div>

                                <input
                                    type="number"
                                    placeholder="Nueva cantidad"
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "15px",
                                        fontSize: "1.3rem",
                                        border: "1px solid white",
                                        background: "rgba(0, 0, 0, 0.8)",
                                        color: "white",
                                        marginBottom: "2em",
                                        boxSizing: "border-box"
                                    }}
                                    min={0}
                                    max={selectedResource.maximumLevel}
                                />

                                <div style={{ display: "flex", gap: "1em", justifyContent: "center" }}>
                                    <button
                                        onClick={() => {
                                            if (newQuantity && !isNaN(Number(newQuantity))) {
                                                handleUpdateQuantity(selectedResource.id, Number(newQuantity));
                                            }
                                        }}
                                        disabled={isUpdating || !newQuantity}
                                        className={homeStyles.btn}
                                        style={{
                                            background: isUpdating ? "#666" : "var(--p-color)",
                                            cursor: isUpdating ? "not-allowed" : "pointer",
                                            padding: "15px 30px",
                                            fontSize: "1.1em"
                                        }}
                                    >
                                        {isUpdating ? "Actualizando..." : "✓ Actualizar"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedResource(null);
                                            setNewQuantity("");
                                        }}
                                        className={homeStyles.btn}
                                        style={{
                                            background: "var(--s-color)",
                                            padding: "15px 30px",
                                            fontSize: "1.1em"
                                        }}
                                    >
                                        ✕ Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
