"use client";

import styles from "../../app/adm/page.module.css";

export default function Entradas({ openModal, openDeleteModal }) 
{
    const PRODUTOS = [
        { id: 1, nome: "Batata Frita com Cheddar e Bacon", preco: "R$ 62,00" },
        { id: 2, nome: "Onion Rings (Anéis de Cebola)", preco: "R$ 68,20" },
        { id: 3, nome: "Mozzarella Sticks (Palitos de Muçarela)", preco: "R$ 77,00" },
        { id: 4, nome: "Super Wings / Chicken Wings", preco: "R$ 82,00" },
        { id: 5, nome: "Dadinhos de Tapioca", preco: "R$ 18,00" },
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
                        <button
                            className={`${styles.botaoAcao} ${styles.botaoDescricao}`}
                            onClick={() => openModal("Ver descrição", produto)}
                        >
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
