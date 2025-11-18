import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoContent}>
                <Image className={styles.logo}
                src="/logo-100spera.png"
                alt="Logo 100spera"
                width={50}
                height={50}
            />
            </div>

            <div className={styles.titleContent}>
            <h1 className={styles.title}>100spera</h1>
            </div>

            <div className={styles.vazio}></div>

        </header>
    )
}