import { useState } from "react"
import styles from "../css/Resource.module.css"
import XcircleIMG from "../media/x-circle-fill.svg"
import CompleteResource from "./CompleteResource";

function Resource ({id, name, unit, quantity, critical_lvl, date}) {
    const [modal, setModal] = useState(true);

    return (
        <article className={`${styles.contain} ${quantity <= critical_lvl ? styles.low : ""}`}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.quantity}>{quantity} <span>{unit}</span></p>
            <div className={styles.btn_container}>
                <button className={styles.btn}>Solicitar</button>
                <button className={styles.btn} onClick={(_) => setModal(false)}>Consultar</button>
            </div>

            <div className={`${!modal ? styles.modal : styles.hidde_modal}`}>
                <div className={styles.modal__content}>
                    <button className={styles.btn_close} onClick={(_) => setModal(true)}>
                        <img src={XcircleIMG} alt="" />
                    </button>

                    <div className={`container ${styles.modal__info}`}>
                        <h2 className={styles.modal__title}>Registro <span>{name}</span></h2>

                        <div className={styles.modal__header}>
                            <p>Nombre</p>
                            <p>Cantidad</p>
                            <p>Fecha</p>
                        </div>
                        <ul className={styles.modal__list}>
                            <CompleteResource key={2} name={name} quantity={quantity} date={date}  />
                        </ul>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Resource