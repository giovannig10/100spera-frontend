import styles from "./kanbanHeader.module.css"

import KanbanHeaderItem from "../kanbanHeaderItem/index.jsx";

export default function KanbanHeader({ columns }) {
    return (
        <article className={styles.kanbanHeader}>
            {columns.map((column) => (
                <KanbanHeaderItem key={column.id} column={column} />
            ))}

        </article>
    )
}
