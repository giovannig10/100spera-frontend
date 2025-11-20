import styles from "./orderCard.module.css";

export default function OrderCard({ order }) {
    return (
        <div key={order.id} className={styles.card}>
            <h2 className={styles.cardTitle}>Order #{order.id}</h2>
        </div>
    );
}