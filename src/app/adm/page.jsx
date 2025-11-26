"use client";

import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import Modal from '../../components/modal';
import { useState } from 'react';

const OPCAO = [
    { id: 'entradas', icon: '🍟', label: 'Entradas' },
    { id: 'lanches', icon: '🍔', label: 'Lanches' },
    { id: 'bebidas', icon: '🥤', label: 'Bebidas' },
    { id: 'sobremesas', icon: '🍨', label: 'Sobremesas' },
    { id: 'combos', icon: '🍽', label: 'Combos' },
];

const PRODUTOS = [
    { id: 1, nome: "Batata Frita com Cheddar e Bacon", preco: "R$ 62,00" },
    { id: 2, nome: "Onion Rings (Anéis de Cebola)", preco: "R$ 68,20" },
    { id: 3, nome: "Mozzarella Sticks (Palitos de Muçarela)", preco: "R$ 77,00" },
    { id: 4, nome: "Super Wings / Chicken Wings", preco: "R$ 82,00" },
    { id: 5, nome: "Dadinhos de Tapioca", preco: "R$ 18,00" },
];

const handleCategoryClick = (categoryId) => {
    console.log(`Categoria selecionada para filtro: ${categoryId}`);
};

const handleProductAction = (action, productNome) => {
    console.log(`${action} para o produto: ${productNome}`);
};

export default function Admin() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });

    const handleTabChange = (path) => {
        router.push(path);
    };

    const openModal = (action, produto) => {
        let title = '';
        let body = '';

        if (action === 'Adicionar novo') {
            title = 'Adicionar Novo Produto';
            body = 'Aqui virá o formulário de adição de novo produto.';
        } else if (action === 'Ver descrição') {
            title = `Descrição de: ${produto.nome}`;
            body = `Detalhes e ingredientes completos do produto ${produto.nome}.`;
        } else if (action === 'Editar') {
            title = `Editar Produto: ${produto.nome}`;
            body = 'Aqui virá o formulário de edição do produto.';
        } else {
            return;
        }

        setModalContent({ title, body });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className={styles.principal}>
                <div className={styles.cardapio}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${styles.tabActive}`}
                            onClick={() => handleTabChange('/admin/cardapio')}
                        >
                            Cardápio
                        </button>
                        <button
                            className={styles.tabButton}
                            onClick={() => handleTabChange('/admin/funcionarios')}
                        >
                            Funcionários
                        </button>
                    </div>

                    <div className={styles.categorias}>
                        {OPCAO.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={styles.categoryButton}
                                aria-label={`Ver ${category.label}`}
                            >
                                <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.listaProdutos}>
                        <div className={styles.descricoes}>
                            <div className={styles.item}>Nome</div>
                            <div className={styles.item}>Imagem</div>
                            <div className={styles.item}>Descrição</div>
                            <div className={styles.item}>Preço</div>
                            <div className={styles.acao}>Ações</div>
                        </div>

                        {PRODUTOS.map((produto) => (
                            <div key={produto.id} className={styles.produtoItem}>
                                <div className={styles.item}>{produto.nome}</div>

                                <div className={styles.item}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc', borderRadius: '6px' }} />
                                </div>

                                <div className={styles.item}>
                                    <button
                                        className={`${styles.botaoAcao} ${styles.botaoDescricao}`}
                                        onClick={() => openModal('Ver descrição', produto)}
                                    >
                                        Ver descrição
                                    </button>
                                </div>

                                <div className={styles.item}>{produto.preco}</div>

                                <div className={styles.acao}>
                                    <button
                                        className={`${styles.botaoAcao} ${styles.botaoEditar}`}
                                        onClick={() => openModal('Editar', produto.nome)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className={`${styles.botaoAcao} ${styles.botaoExcluir}`}
                                        onClick={() => handleProductAction('Excluir', produto.nome)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.aside}>
                    <button
                        className={styles.addBotao}
                        onClick={() => openModal('Adicionar novo', '')}
                    >
                        <span>Adicionar</span>
                        <span className={styles.iconeAdd}>+</span>
                    </button>
                </div>
                <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalContent.title}
            >
                
                <p>{modalContent.body}</p>
            </Modal>
            </div>
        </>
    );
}