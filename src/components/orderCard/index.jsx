import styles from "./orderCard.module.css";

export default function OrderCard({ order, orderItems }) {

    //receber pedido;
    // receber items de pedido;
    // filtrar na tabela de items pedido o id do pedido

    const orderItem = orderItems.map((oi) => oi.orderId === order.id)
    return (
        <div key={order.id} className={styles.card}>
            <h1 className={styles.orderDetails}>Mesa {order.tableNumber}</h1>
            {orderItems.map((item) => (
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
    );
}