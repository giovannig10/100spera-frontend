"use client";

import styles from "./kanbanColumnsContainer.module.css"

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import KanbanColumn from "../kanbanColumn"

export default function KanbanColumnsContainer({ columns }) {

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
    <section className={styles.kanbanColumnsContainer}>
            {columns.map((column) => (
                <KanbanColumn key={column.id} orders={orders} orderItems={orderItems} fetchData={fetchData} column={column}/>
            ))}
        </section>
  )
}
