import styles from "./cozinha.module.css";

export default function Kitchen() {
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
