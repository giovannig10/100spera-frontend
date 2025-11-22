"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./orderCard.module.css";

export default function OrderCard({ order, orderItems }) {

    const orderItem = orderItems.map((oi) => oi.orderId === order.id);

    const filteredOrderItems = orderItems.filter((item) => item.orderId === order.id);

    const [orderStatus, setOrderStatus] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async () => {
        let newStatus = "";

        if (order.status === "pendente") {
            order.status = "em preparo";
        } else if (order.status === "em preparo") {
            order.status = "pronto";
        } else if (order.status === "pronto") {
            order.status = "entregue";
        } else {
            alert("O pedido já foi concluído e entregue.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/100spera/orders/${order.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: order.status,
                    tableNumber: order.tableNumber,
                    userId: order.userId
                }),
            });
            if (response.ok) {
                // window.location.reload();
                const data = await response.json();
                console.log("Atualizado com sucesso", data);
            } else if (!response.ok) {
                throw new Error("Falha ao atualizar");
            }
        } catch (error) {
            console.error("Erro ao atualizar o status", error);
        } finally {
            setIsLoading(false);
        }
        console.log("valor do status:", newStatus);
        console.log(order.status);
    };

    return (
        <div key={order.id} className={styles.card}>
            <div className={styles.buttonBar}>
                <button
                    className={styles.setStatusButton}
                    onClick={handleStatusChange}
                >
                    {
                        order.status === "pendente" ? <Image alt="imagem de iniciar preparo" src="/images/status-icons/prepare.png" width={40} height={40}></Image>
                            : order.status === "em preparo" ? <Image alt="imagem de iniciar preparo" src="/images/status-icons/finish.png" width={40} height={40}></Image>
                                : order.status === "pronto" ? <Image alt="imagem de iniciar preparo" src="/images/status-icons/deliver.png" width={40} height={40}></Image>
                                    : <Image alt="imagem de iniciar preparo" src="/images/status-icons/done.png" width={40} height={40}></Image>}
                </button>
            </div>
            <div className={styles.contentContainer}>
                <h1 className={styles.orderDetails}>Mesa {order.tableNumber}</h1>
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
        </div>
    );
}