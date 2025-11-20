"use client";

import { useState, useEffect } from "react";
import styles from "./kanbanFrame.module.css";
import axios from "axios";

import OrderCard from "../orderCard/index.jsx";

export default function KanbanFrame() {
  const ordersUrl = "http://localhost:4000/100spera/orders";
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(ordersUrl);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <article className={styles.kanbanFrame}>
      <div className={styles.kanbanColumnsContainer}></div>
      <section className={styles.kanbanColumn}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
      <section className={styles.kanbanColumn}></section>
      <section className={styles.kanbanColumn}></section>
    </article>
  );
}
