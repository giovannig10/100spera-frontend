import styles from './page.module.css';

export default function AdminPage() {
  return (
    <main className={styles.main}>
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboard}>
                <div className={styles.titleDiv}>
                    <h1 className={styles.title}>Cardápio</h1>
                    <h1 className={styles.title}>Funcionários</h1>
                </div>

                <div className={styles.infosContainer}>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                </div>

                <div className={styles.infosContainer}>
                    <p className={styles.dishTitle}>Nome</p>
                    <p className={styles.dishTitle}>Imagem</p>
                    <p className={styles.dishTitle}>Descrição</p>
                    <p className={styles.dishTitle}>Preço</p>
                    <p className={styles.dishTitle}>Ações</p>
                </div>

                <div className={styles.itemContainer}>
                    <p className={styles.item}>Btata frita com cheddar</p>
                    {/* <Image /> */}
                    <button>Ver descrição</button>
                    <p className={styles.item}>R$ 29,90</p>
                    <button>Editar</button>
                    <button>Excluir</button>
                </div>

            </div>
                <button className={styles.button}>
                    <p className={styles.buttonText}>Adicionar </p> <span className={styles.emoji}>+</span>
                </button>
    
        </div>
    </main>
  );
}