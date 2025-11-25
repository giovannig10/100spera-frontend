import styles from "./kanbanHeaderItem.module.css";

export default function KanbanHeaderItem({ column }) {
    return (
        <section className={styles.columnTitle}>
            <h1 className={styles.titleText}>{column.title}</h1>
        </section>
    )
}
