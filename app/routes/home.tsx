import type { Route } from "./+types/home"
import styles from "../css/Home.module.css"
import Resource from "../components/Resource"
import { data, Link } from "react-router"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"

const socket = io("");

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitoreo de recursos" },
    { name: "description", content: "Monitoreo de recursos de la colonia" },
  ];
}

export default function Home() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    socket.on("connection", () => {
      setResources((prev) => [...prev, data])
    })

    return () => {
      socket.off("connection")
    }
  }, [])

  return (
    <div className="container">
      <div className={styles.contain}>
        <h1 className={styles.title}><span>Monitoreo</span> de recursos</h1>

        <div className={styles.btn_actions}>
          <Link className={styles.btn} to="/gestionar">Gestionar recursos</Link>
          <button className={styles.btn}>Pedir todos los recursos</button>
        </div>

        <section className={styles.resources}>
          <Resource key={1} name="Agua" critical_lvl={50} quantity={1000} unit="L" date="05-03-2025" />
          <Resource key={2} name="Agua" critical_lvl={50} quantity={130} unit="L" date="03-08-2025" />
          <Resource key={3} name="Piezas de repuesto" critical_lvl={50} quantity={500} unit="U" date="04-11-2025" />
          <Resource key={4} name="Agua" critical_lvl={50} quantity={20} unit="L" date="03-12-2025" />
        </section>
      </div>
    </div>
  )
}
