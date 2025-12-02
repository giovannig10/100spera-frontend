import styles from "./not-found.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>

        <div className={styles.messageContainer}>
          <h2 className={styles.title}>Página não encontrada</h2>
          <p className={styles.description}>
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <Link href="/" className={styles.button}>
          Voltar
        </Link>
      </div>
    </div>
  );
}
