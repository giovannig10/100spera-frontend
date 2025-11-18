"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        if (!usuario || !senha) {
            setErro("Por favor, preencha todos os campos.");
            setCarregando(false);
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('tipoUsuario', data.type);
            
            if (data.type === 'garcom') {
                router.push("/garcom");
            } else if (data.type === 'caixa') {
                router.push("/caixa");
            } else if (data.type === 'cozinha') {
                router.push("/cozinha");
            } else if (data.type === 'administrador') {
                router.push("/administrador");
            } else {
                setErro("Tipo de usuário inválido");
            }
            
        } catch (error) {
            setErro("Usuário ou senha incorretos.");
        } finally {
            setCarregando(false);
        }
    };

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
                    <form className={styles.forms} onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Usuário</label>
                            <input
                                type="text"
                                placeholder="Digite o nome do usuário"
                                className={styles.input}
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                disabled={carregando}
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Senha</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite a senha"
                                    className={styles.input}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    disabled={carregando}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {erro && <p className={styles.erro}>{erro}</p>}

                        <div className={styles.buttonContainer}>
                            <button 
                                type="submit" 
                                className={styles.button}
                                disabled={carregando}
                            >
                                {carregando ? "Entrando..." : "Entrar"}
                            </button>
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
