import type { Route } from "./+types/home"
import { Link } from "react-router"
import styles from "../css/Manager.module.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestionar" },
    { name: "description", content: "Monitoreo de recursos de la colonia" },
  ];
}

export default () => {
    return (
        <div className="container">
            <h1>Gestionar recursos</h1>
        </div>
    )
}