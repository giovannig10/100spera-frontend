import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.logoContent}>
                    <Image
                        className={styles.logo}
                        src="/images/logo.png"
                        alt="Logo 100spera"
                        fill
                        quality={95}
                    />
                </div>

                <div className={styles.formsContainer}>
                    <form className={styles.forms}>
                        <div className={styles.inputContainer}>
                        <label className={styles.label}>Usuário</label>
                        <input
                            type="text"
                            placeholder="Digite o nome do usuário"
                            className={styles.input}
                        />
                        </div>

                        <div className={styles.inputContainer}>
                        <label className={styles.label}>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite a senha"
                            className={styles.input}
                        />
                        </div>

                        <div className={styles.buttonContainer}>
                        <button className={styles.button}>Entrar</button>
                        <p className={styles.message}>
                            Não possui uma conta? <span style={{textDecoration: 'underline'}}>apenas o administrador pode cadastrar.</span>
                        </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
