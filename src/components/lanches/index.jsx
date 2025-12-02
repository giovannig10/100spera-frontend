"use client";

import styles from "../../app/adm/page.module.css";

export default function Lanches({ openModal, openDeleteModal }) {
    const PRODUTOS = [
        { id: 6, nome: "Cheeseburger Tradicional", preco: "R$ 34,90" },
        { id: 7, nome: "Duplo Bacon Burger", preco: "R$ 42,50" },
        { id: 8, nome: "Chicken Crispy Burger", preco: "R$ 37,00" },
        { id: 9, nome: "Veggie Burger (Grão-de-bico)", preco: "R$ 39,90" },
        { id: 10, nome: "Smash Burger Especial", preco: "R$ 36,00" },
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
