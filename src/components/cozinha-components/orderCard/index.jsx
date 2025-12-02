"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./orderCard.module.css";
import Timer from "../timer";

export default function OrderCard({ order, orderItems, onUpdate }) {

    const orderItem = orderItems.map((oi) => oi.orderId === order.id);

    const filteredOrderItems = orderItems.filter((item) => item.orderId === order.id);

    const [orderStatus, setOrderStatus] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const startTime = new Date(order.createdAt).getTime(); // Assumindo que order tem createdAt

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000); // diferença em segundos
            setElapsedTime(diff);
        }, 1000);

        return () => clearInterval(interval);
    }, [order.createdAt]);

    // Função para formatar o tempo (MM:SS ou HH:MM:SS)
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

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
                const data = await response.json();
                console.log("Atualizado com sucesso", data);

                if (onUpdate) {
                    await onUpdate();
                }
            } else if (!response.ok) {
                console.log("Falha ao atualizar");
            }
        } catch (error) {
            console.error("Erro ao atualizar o status", error);
        } finally {
            setIsLoading(false);
        }
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
                <Timer filteredOrderItems={filteredOrderItems} elapsedTime={elapsedTime} formatTime={formatTime} />
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