import styles from "./cozinha.module.css";

export default function Kitchen() {

  const pedidos = [
    { id: 1, table: 5, items: [ { name: "Pizza", quantity: 2 }, { name: "Coke", quantity: 1 } ], status: "pendente" },
    { id: 2, table: 3, items: [ { name: "Burger", quantity: 1 } ], status: "em preparo" },
    { id: 3, table: 8, items: [ { name: "Pasta", quantity: 1 }, { name: "Wine", quantity: 1 } ], status: "pronto" },
  ]


  return (
    <main className={styles.content}>
      <article className={styles.kanbanHeader}>
        <section className={styles.columnTitle}>
          <h1 className={styles.titleText}>NOVOS PEDIDOS</h1>
        </section>
        <section className={styles.columnTitle}>
          <h1 className={styles.titleText}>EM PREPARO</h1>
        </section>
        <section className={styles.columnTitle}>
          <h1 className={styles.titleText}>PRONTOS</h1>
        </section>
      </article>
      <article className={styles.kanbanFrame}>
        <div className={styles.kanbanColumnsContainer}></div>
          <section className={styles.kanbanColumn}></section>
          <section className={styles.kanbanColumn}></section>
          <section className={styles.kanbanColumn}></section>
      </article>
    </main>
  );
}
