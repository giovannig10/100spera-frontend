"use client";

import styles from "../../app/adm/page.module.css";

export default function Combos({ openModal, openDeleteModal }) {
    const PRODUTOS = [
        { id: 21, nome: "Combo Clássico (Cheeseburger + Batata + Refri)", preco: "R$ 49,90" },
        { id: 22, nome: "Combo Duplo Bacon (Burger + Batata + Refri)", preco: "R$ 57,00" },
        { id: 23, nome: "Combo Chicken Crispy (Burger + Batata + Suco)", preco: "R$ 52,00" },
        { id: 24, nome: "Combo Veggie (Veggie Burger + Batata + Chá Gelado)", preco: "R$ 54,90" },
        { id: 25, nome: "Combo Kids (Mini Burger + Batata + Suquinho)", preco: "R$ 33,00" },
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
