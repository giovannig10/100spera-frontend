import styles from "./cozinha.module.css";
import KanbanFrame from "@/components/kanbanFrame";

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

      <KanbanFrame />
      
    </main>
  );
}
