import styles from "../orderCard/orderCard.module.css";

export default function Timer({ filteredOrderItems, elapsedTime, formatTime }) {
    return (
        <div className={styles.timer}>
            <p>TEMPO {formatTime(elapsedTime)}</p>
            {filteredOrderItems.map((item) => (
                <div key={item.id} className={styles.orderItemContainer}>
                    <div className={styles.itemsBox}>
                        <p className={`${styles.itemDetails} ${styles.itemQuantity}`}>
                            -{item.quantity}x
                        </p>
                        <p className={`${styles.itemDetails} ${styles.itemDishName}`}>
                            {item.dish.name}
                        </p>
                    </div>
                    <p className={`${styles.itemDetails} ${styles.itemObservations}`}>
                        {item.observations}
                    </p>
                </div>
            ))}
        </div>
    )
}
