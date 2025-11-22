"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./kanbanFrame.module.css";
import axios from "axios";

import OrderCard from "../orderCard/index.jsx";

export default function KanbanFrame() {
  const ordersUrl = "http://localhost:4000/100spera/orders";
  const orderItemsUrl = "http://localhost:4000/100spera/order-items";

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const ordersResponse = await axios.get(ordersUrl);
      setOrders(ordersResponse.data);

      const itemsResponse = await axios.get(orderItemsUrl);
      setOrderItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // o eslint fica retornando essa mensagem de erro em vermelho, mas é só um aviso e não compromete a funcionalidade
  }, [fetchData]);

  return (
    <article className={styles.kanbanFrame}>
      <div className={styles.kanbanColumnsContainer}></div>
      <section className={styles.kanbanColumn}>
        {orders.map((order) => (
          order.status === "pendente" ?
            <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData}/>
            : null
        ))}
      </section>
      <section className={styles.kanbanColumn}>
        {orders.map((order) => (
          order.status === "em preparo" ?
            <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData}/>
            : null
        ))}
      </section>
      <section className={styles.kanbanColumn}>
        {orders.map((order) => (
          order.status === "pronto" ?
            <OrderCard key={order.id} order={order} orderItems={orderItems} onUpdate={fetchData}/>
            : null
        ))}
      </section>
    </article>
  );
}
