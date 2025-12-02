"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [accessCode, setAccessCode] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        if (!accessCode || accessCode.trim() === "") {
            setErro("Por favor, preencha o código de acesso.");
            setCarregando(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/100spera/users/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessCode: accessCode.trim() })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciais inválidas');
            }

            if (!data.token || !data.userExists) {
                throw new Error('Resposta inválida do servidor');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('tipoUsuario', data.userExists.type);
            localStorage.setItem('userId', data.userExists.id.toString());
            localStorage.setItem('userName', data.userExists.name);
            
            switch(data.userExists.type.toLowerCase()) {
                case 'garcom':
                case 'garçom':
                    router.push("/garcom");
                    break;
                case 'caixa':
                    router.push("/caixa");
                    break;
                case 'cozinha':
                    router.push("/cozinha");
                    break;
                case 'administrador':
                case 'admin':
                    router.push("/adm");
                    break;
                default:
                    setErro(`Tipo de usuário não reconhecido: ${data.userExists.type}`);
                    setCarregando(false);
            }
            
        } catch (error) {
            if (error.message.includes("Failed to fetch")) {
                setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
            } else if (error.message.includes("deu pau aqui")) {
                setErro("Código de acesso incorreto. Verifique e tente novamente.");
            } else {
                setErro(error.message || "Código de acesso incorreto.");
            }
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
                        priority
                    />
                </div>

                <div className={styles.formsContainer}>
                    <form className={styles.forms} onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Código de Acesso</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite seu código de acesso"
                                    className={styles.input}
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    disabled={carregando}
                                    autoComplete="off"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    aria-label={mostrarSenha ? "Ocultar código" : "Mostrar código"}
                                    disabled={carregando}
                                    tabIndex={-1}
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

                        {erro && (
                            <div className={styles.erroContainer}>
                                <p className={styles.erro}>{erro}</p>
                            </div>
                        )}

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