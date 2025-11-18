import styles from "./kanbanFrame.module.css";

export default function KanbanFrame() {
  return (
    <article className={styles.kanbanFrame}>
      <div className={styles.kanbanColumnsContainer}></div>
      <section className={styles.kanbanColumn}></section>
      <section className={styles.kanbanColumn}></section>
      <section className={styles.kanbanColumn}></section>
    </article>
  );
}
