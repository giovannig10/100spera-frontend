"use client";

import styles from "../../app/adm/page.module.css";

export default function Bebidas({ openModal, openDeleteModal }) {
    const PRODUTOS = [
        { id: 11, nome: "Refrigerante Lata", preco: "R$ 8,00" },
        { id: 12, nome: "Suco Natural 500ml", preco: "R$ 12,00" },
        { id: 13, nome: "Água com Gás", preco: "R$ 6,00" },
        { id: 14, nome: "Milkshake Chocolate", preco: "R$ 18,50" },
        { id: 15, nome: "Chá Gelado", preco: "R$ 10,00" },
    ];

    return (
        <>
            {PRODUTOS.map((produto) => (
                <div key={produto.id} className={styles.produtoItem}>
                    <div className={styles.item}>{produto.nome}</div>

                    <div className={styles.item}>
                        <div style={{ width: "50px", height: "50px", backgroundColor: "#ccc", borderRadius: "6px" }} />
                    </div>

                    <div className={styles.item}>
                        <button className={`${styles.botaoAcao} ${styles.botaoDescricao}`} onClick={() => openModal("Ver descrição", produto)}>
                            Ver descrição
                        </button>
                    </div>

                    <div className={styles.item}>{produto.preco}</div>

                    <div className={styles.acao}>
                        <button className={`${styles.botaoAcao} ${styles.botaoEditar}`} onClick={() => openModal("Editar", produto)}>
                            Editar
                        </button>
                        <button className={`${styles.botaoAcao} ${styles.botaoExcluir}`} onClick={() => openDeleteModal(produto)}>
                            Excluir
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
