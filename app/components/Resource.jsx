import { useState } from "react"
import styles from "../css/Resource.module.css"

function Resource ({name, unit, quantity, critical_lvl}) {
    const [modal, setModal] = useState(false);

    return (
        <div className={`${styles.contain} ${quantity <= critical_lvl ? styles.low : ""}`}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.quantity}>{quantity} <span>{unit}</span></p>
            <div>
                <button>Pedir recurso</button>
            </div>
        </div>
    )
}

export default Resource