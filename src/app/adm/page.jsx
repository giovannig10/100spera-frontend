"use client";

import styles from "./page.module.css";
import { useState } from "react";
import Modal from "../../components/modal";

import Entradas from "../../components/entrada";
import Lanches from "../../components/lanches";
import Bebidas from "../../components/bebidas";
import Sobremesas from "../../components/sobremesas";
import Combos from "../../components/combos";

const OPCAO = [
    { id: "entradas", icon: "🍟", label: "Entradas" },
    { id: "lanches", icon: "🍔", label: "Lanches" },
    { id: "bebidas", icon: "🥤", label: "Bebidas" },
    { id: "sobremesas", icon: "🍨", label: "Sobremesas" },
    { id: "combos", icon: "🍽", label: "Combos" },
];

export default function Admin() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("entradas");


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", body: "" });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const openModal = (action, produto) => {
        let title = "";
        let body = "";

        if (action === "Adicionar novo") {
            title = "Nome";
            body = "Formulário para novo produto.";
        } else if (action === "Ver descrição") {
            title = `Descrição de: ${produto.nome}`;
            body = `Detalhes da comida ${produto.nome}.`;
        } else if (action === "Editar") {
            title = `Editar: ${produto.nome}`;
            body = "Formulário de edição.";
        }

        setModalContent({ title, body });
        setIsModalOpen(true);
    };

    const openDeleteModal = (produto) => {
        setProductToDelete(produto);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);


    const renderCategoria = () => {
        switch (categoriaAtiva) {
            case "entradas":
                return <Entradas openModal={openModal} openDeleteModal={openDeleteModal} />;

            case "lanches":
                return <Lanches openModal={openModal} openDeleteModal={openDeleteModal} />;

            case "bebidas":
                return <Bebidas openModal={openModal} openDeleteModal={openDeleteModal} />;

            case "sobremesas":
                return <Sobremesas openModal={openModal} openDeleteModal={openDeleteModal} />;

            case "combos":
                return <Combos openModal={openModal} openDeleteModal={openDeleteModal} />;

            default:
                return null;
        }
    };

    return (
        <div className={styles.principal}>
            <div className={styles.cardapio}>

                
                <div className={styles.tabs}>
                    <button className={`${styles.tabButton} ${styles.tabActive}`}>
                        Cardápio
                    </button>

                    <button className={styles.tabButton}>
                        Funcionários
                    </button>
                </div>

        
                <div className={styles.categorias}>
                    {OPCAO.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setCategoriaAtiva(category.id)}
                            className={styles.categoryButton}
                        >
                            <span style={{ fontSize: "2rem" }}>{category.icon}</span>
                        </button>
                    ))}
                </div>

        
                <div className={styles.listaProdutos}>
                    {renderCategoria()}
                </div>

            
                <button
                    className={styles.addBotao}
                    onClick={() => openModal("Adicionar novo", null)}
                >
                    <span>Adicionar +</span>
                </button>

            </div>

        
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.body}</p>
            </Modal>

        
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="⚠️ Confirmação de Exclusão"
            >
                {productToDelete && (
                    <>
                        <h3>Tem certeza que deseja excluir ➡️ {productToDelete.nome}?</h3>

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={closeDeleteModal}
                                style={{
                                    backgroundColor: "#d0e3c3",
                                    color: "white",
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Confirmar
                            </button>

                            <button
                                onClick={closeDeleteModal}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #d0e3c3",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    background: "#eee",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
