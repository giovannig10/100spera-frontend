"use client";

import styles from "../../app/adm/page.module.css";

export default function Sobremesas({ openModal, openDeleteModal }) {
    const PRODUTOS = [
        { id: 16, nome: "Pudim Tradicional", preco: "R$ 14,90" },
        { id: 17, nome: "Sorvete 2 Bolas", preco: "R$ 12,00" },
        { id: 18, nome: "Brownie com Sorvete", preco: "R$ 19,00" },
        { id: 19, nome: "Milkshake Morango", preco: "R$ 17,00" },
        { id: 20, nome: "Petit Gateau", preco: "R$ 22,00" },
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
