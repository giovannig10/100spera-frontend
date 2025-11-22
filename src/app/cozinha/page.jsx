import styles from "./cozinha.module.css";

import KanbanColumnsContainer from "@/components/cozinha-components/kanbanColumnsContainer";
import KanbanHeader from "@/components/cozinha-components/kanbanHeader";

export default function Kitchen() {

  const columns = [{
    id: 1,
    title: "NOVOS PEDIDOS",
    status: 0
  }, {
    id: 2,
    title: "EM PREPARO",
    status: 1
  }, {
    id: 3,
    title: "PRONTOS",
    status: 2
  }];

  return (
    <main className={styles.content}>
      <KanbanHeader columns={columns} />
      <KanbanColumnsContainer columns={columns}/>
    </main>
  );
}
