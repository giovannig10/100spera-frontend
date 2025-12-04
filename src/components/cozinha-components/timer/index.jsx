import styles from "../orderCard/orderCard.module.css";

export default function Timer({ elapsedTime, formatTime }) {
    return (
        <div className={styles.timer}>
            <p>TEMPO {formatTime(elapsedTime)}</p>
        </div>
    )
}
