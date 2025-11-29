import styles from "../css/CompleteResource.module.css"

export default ({name, quantity, date}) => {
    return (
        <li className={styles.contain}>
            <p>{name}</p>
            <p>{quantity}</p>
            <p>{date}</p>
        </li>
    )
}