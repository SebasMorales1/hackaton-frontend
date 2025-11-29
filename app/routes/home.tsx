import type { Route } from "./+types/home"
import styles from "../css/Home.module.css"
import Resource from "../components/Resource"
import { Link } from "react-router"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monitoreo de recursos" },
    { name: "description", content: "Monitoreo de recursos de la colonia" },
  ];
}

export default function Home() {
  return (
    <div className="container">
      <div className={styles.contain}>
        <h1 className={styles.title}><span>Monitoreo</span> de recursos</h1>

        <div className={styles.btn_actions}>
          <Link className={styles.btn} to="/gestionar">Gestionar recursos</Link>
          <Link className={styles.btn} to="/gestionar">Pedir todos los recursos</Link>
        </div>

        <section className={styles.resources}>
          <Resource key={1} name="Agua" critical_lvl={50} quantity={1000} unit="L" />
          <Resource key={1} name="Agua" critical_lvl={50} quantity={130} unit="L" />
          <Resource key={1} name="Agua" critical_lvl={50} quantity={500} unit="L" />
          <Resource key={1} name="Agua" critical_lvl={50} quantity={20} unit="L" />
          <Resource key={1} name="Agua" critical_lvl={50} quantity={2000} unit="L" />
        </section>
      </div>
    </div>
  )
}
