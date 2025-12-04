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

                <div className={styles.categoryContainer}>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                    <p className={styles.categoryTitle}>Entrada</p>
                </div>
            </div>
                <button className={styles.button}>
                    <p className={styles.buttonText}>Adicionar </p> <span className={styles.emoji}>+</span>
                </button>
    
        </div>
    </main>
  );
}