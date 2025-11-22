import styles from "./kanbanColumn.module.css"

import OrderCard from "../orderCard";

export default function KanbanColumn({ orders, orderItems, fetchData, column }) {
    return (
        <div key={column.id} className={styles.kanbanColumn}>
            {orders.map((order) => (
                column.status === 0 && order.status === "pendente" ?
                    <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData} />
                    : column.status === 1 && order.status === "em preparo" ?
                        <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData} />
                        : column.status === 2 && order.status === "pronto" ?
                            <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData} />
                            : null
            ))}
        </div>
    )
}
