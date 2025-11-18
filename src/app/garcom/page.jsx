'use client';
import { useState } from "react";
import styles from "./garcom.module.css";

export default function Home() {
    const [mesaSelecionada, setMesaSelecionada] = useState(null);
    const [etapa, setEtapa] = useState(null); // 'escolherEstado' ou 'pedido'
    const [estadoMesa, setEstadoMesa] = useState({
        1: 'vazia', 2: 'vazia', 3: 'vazia', 4: 'vazia', 5: 'vazia', 6: 'vazia',
        7: 'vazia', 8: 'vazia', 9: 'vazia', 10: 'vazia', 11: 'vazia', 12: 'vazia',
        13: 'vazia', 14: 'vazia', 15: 'vazia', 16: 'vazia', 17: 'vazia', 18: 'vazia',
        19: 'vazia', 20: 'vazia', 21: 'vazia', 22: 'vazia', 23: 'vazia', 24: 'vazia'
    });
    const [categoriaAtiva, setCategoriaAtiva] = useState('entrada');
    const [itensPedido, setItensPedido] = useState([]);
    const [observacoes, setObservacoes] = useState('');
    const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
    const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
    const [mostrarModalAviso, setMostrarModalAviso] = useState(false);

    // Produtos por categoria
    const produtos = {
        entrada: [
            { id: 1, nome: 'Bruschetta', preco: 18.00, imagem: 'https://via.placeholder.com/80' },
            { id: 2, nome: 'Batata Frita', preco: 15.00, imagem: 'https://via.placeholder.com/80' },
            { id: 3, nome: 'Batata Frita', preco: 15.00, imagem: 'https://via.placeholder.com/80' },
            { id: 4, nome: 'Batata Frita', preco: 15.00, imagem: 'https://via.placeholder.com/80' },
            { id: 5, nome: 'Batata Frita', preco: 15.00, imagem: 'https://via.placeholder.com/80' },
            { id: 6, nome: 'Batata Frita', preco: 15.00, imagem: 'https://via.placeholder.com/80' }
        ],
        pratoPrincipal: [
            { id: 3, nome: 'Hamburguer Clássico', preco: 37.00, imagem: 'https://via.placeholder.com/80' },
            { id: 4, nome: 'X-Tudo!', preco: 52.00, imagem: 'https://via.placeholder.com/80' }
        ],
        bebidas: [
            { id: 5, nome: 'Coca Cola Zero', preco: 8.00, imagem: 'https://via.placeholder.com/80' },
            { id: 6, nome: 'Suco Natural', preco: 10.00, imagem: 'https://via.placeholder.com/80' }
        ],
        drinks: [
            { id: 7, nome: 'Caipirinha', preco: 22.00, imagem: 'https://via.placeholder.com/80' },
            { id: 8, nome: 'Mojito', preco: 25.00, imagem: 'https://via.placeholder.com/80' }
        ],
        sobremesas: [
            { id: 9, nome: 'Brownie', preco: 12.00, imagem: 'https://via.placeholder.com/80' },
            { id: 10, nome: 'Pudim', preco: 10.00, imagem: 'https://via.placeholder.com/80' }
        ]
    };

    const handleMesaClick = (mesaNumero) => {
        setMesaSelecionada(mesaNumero);
        setEtapa('escolherEstado');
    };

    const handleEstadoClick = (estado) => {
        setEstadoMesa({ ...estadoMesa, [mesaSelecionada]: estado });
        if (estado === 'ocupada') {
            setEtapa('pedido');
            setItensPedido([]);
            setObservacoes('');
        } else {
            setEtapa(null);
            setMesaSelecionada(null);
        }
    };

    const handleAdicionarItem = (produto) => {
        const itemExistente = itensPedido.find(item => item.id === produto.id);
        if (itemExistente) {
            setItensPedido(itensPedido.map(item => 
                item.id === produto.id 
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            ));
        } else {
            setItensPedido([...itensPedido, { ...produto, quantidade: 1 }]);
        }
    };

    const calcularTotal = () => {
        return itensPedido.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2);
    };

    const handleEnviarCozinha = () => {
        if (itensPedido.length === 0) {
            setMostrarModalAviso(true);
            return;
        }
        setMostrarModalConfirmacao(true);
    };

    const confirmarEnvio = () => {
        setMostrarModalConfirmacao(false);
        setMostrarModalSucesso(true);
    };

    const cancelarEnvio = () => {
        setMostrarModalConfirmacao(false);
    };

    const fecharModalSucesso = () => {
        setMostrarModalSucesso(false);
        setEtapa(null);
        setMesaSelecionada(null);
        setItensPedido([]);
        setObservacoes('');
    };

    const handleCancelar = () => {
        setMostrarModalCancelamento(true);
    };

    const confirmarCancelamento = () => {
        setMostrarModalCancelamento(false);
        setEtapa(null);
        setMesaSelecionada(null);
        setItensPedido([]);
        setObservacoes('');
    };

    const cancelarCancelamento = () => {
        setMostrarModalCancelamento(false);
    };

    const fecharModalAviso = () => {
        setMostrarModalAviso(false);
    };

    const getMesaEstilo = (mesaNumero) => {
        const estado = estadoMesa[mesaNumero];
        if (mesaNumero === mesaSelecionada) return styles.mesaButtonSelecionada;
        if (estado === 'ocupada') return `${styles.mesaButton} ${styles.mesaOcupada}`;
        if (estado === 'vazia') return `${styles.mesaButton} ${styles.mesaVazia}`;
        return styles.mesaButton;
    };

    return (
        <main className={styles.main}>
            <div className={styles.header}> 
                <h2 className={styles.text}>Mapa de Mesas</h2>
                <div className={styles.cores}>
                    <div className={styles.ocupada}></div>
                    <h4 className={styles.text}>Ocupada</h4>
                    <div className={styles.vazia}></div>
                    <h4 className={styles.text}>Vazia</h4>
                    <div className={styles.selecionada}></div> 
                    <h4 className={styles.text}>Selecionada</h4>
                </div>
            </div>
            
            <div className={styles.contentArea}>
                <div className={styles.mesasGrid}>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button 
                            key={num} 
                            className={getMesaEstilo(num)}
                            onClick={() => handleMesaClick(num)}
                        >
                            Mesa {num}
                        </button>
                    ))}
                    
                    {[7, 8, 9, 10, 11, 12].map((num) => (
                        <button 
                            key={num} 
                            className={getMesaEstilo(num)}
                            onClick={() => handleMesaClick(num)}
                        >
                            Mesa {num}
                        </button>
                    ))}
                    
                    {[13, 14, 15, 16, 17, 18].map((num) => (
                        <button 
                            key={num} 
                            className={getMesaEstilo(num)}
                            onClick={() => handleMesaClick(num)}
                        >
                            Mesa {num}
                        </button>
                    ))}
                    
                    {[19, 20, 21, 22, 23, 24].map((num) => (
                        <button 
                            key={num} 
                            className={getMesaEstilo(num)}
                            onClick={() => handleMesaClick(num)}
                        >
                            Mesa {num}
                        </button>
                    ))}
                </div>

                {/* Painel lateral sempre visível */}
                {!etapa ? (
                    <div className={styles.painelVazio}>
                        <p className={styles.textoVazio}>Selecione uma mesa para começar</p>
                    </div>
                ) : etapa === 'escolherEstado' ? (
                    <div className={styles.painelLateral}>
                        <h3 className={styles.painelTitulo}>Mesa {mesaSelecionada}</h3>
                        <button 
                            className={styles.botaoEstado}
                            onClick={() => handleEstadoClick('ocupada')}
                        >
                            Ocupada
                        </button>
                        <button 
                            className={styles.botaoEstado}
                            onClick={() => handleEstadoClick('vazia')}
                        >
                            Vazia
                        </button>
                    </div>
                ) : etapa === 'pedido' && (
                    <>
                        <div className={styles.painelPedido}>
                            <h3 className={styles.painelTitulo}>Pedido</h3>
                            
                            {/* Abas de categoria */}
                            <div className={styles.abasCategoria}>
                                <button 
                                    className={categoriaAtiva === 'entrada' ? styles.abaAtiva : styles.aba}
                                    onClick={() => setCategoriaAtiva('entrada')}
                                >
                                    Entradas
                                </button>
                                <button 
                                    className={categoriaAtiva === 'pratoPrincipal' ? styles.abaAtiva : styles.aba}
                                    onClick={() => setCategoriaAtiva('pratoPrincipal')}
                                >
                                    Prato Principal
                                </button>
                                <button 
                                    className={categoriaAtiva === 'bebidas' ? styles.abaAtiva : styles.aba}
                                    onClick={() => setCategoriaAtiva('bebidas')}
                                >
                                    Bebidas
                                </button>
                                <button 
                                    className={categoriaAtiva === 'drinks' ? styles.abaAtiva : styles.aba}
                                    onClick={() => setCategoriaAtiva('drinks')}
                                >
                                    Drinks
                                </button>
                                <button 
                                    className={categoriaAtiva === 'sobremesas' ? styles.abaAtiva : styles.aba}
                                    onClick={() => setCategoriaAtiva('sobremesas')}
                                >
                                    Sobremesas
                                </button>
                            </div>

                            {/* Cards de produtos */}
                            <div className={styles.produtosLista}>
                                {produtos[categoriaAtiva].map(produto => (
                                    <div 
                                        key={produto.id}
                                        className={styles.produtoCard}
                                        onClick={() => handleAdicionarItem(produto)}
                                    >
                                        <img 
                                            src={produto.imagem} 
                                            alt={produto.nome} 
                                            className={styles.produtoImagem}
                                        />
                                        <div className={styles.produtoInfo}>
                                            <h4 className={styles.produtoNome}>{produto.nome}</h4>
                                            <span className={styles.produtoPreco}>R$ {produto.preco.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Painel de Resumo do Pedido */}
                        <div className={styles.painelResumo}>
                            <button className={styles.botaoAdicionarItem}>
                                Adicionar item
                            </button>

                            <div className={styles.itensPedido}>
                                <h4 className={styles.subtitulo}>Itens do Pedido</h4>
                                {itensPedido.length === 0 ? (
                                    <p className={styles.itemTexto}>Nenhum item adicionado</p>
                                ) : (
                                    itensPedido.map(item => (
                                        <p key={item.id} className={styles.itemTexto}>
                                            -{item.quantidade}x {item.nome}
                                        </p>
                                    ))
                                )}
                            </div>

                            <div className={styles.observacoes}>
                                <label className={styles.subtitulo}>Observações:</label>
                                <textarea 
                                    className={styles.textareaObs}
                                    placeholder="Digite aqui observações..."
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                />
                            </div>

                            <div className={styles.totalPedido}>
                                <span className={styles.textoTotal}>R$ {calcularTotal()}</span>
                            </div>

                            <div className={styles.botoesPedido}>
                                <button 
                                    className={styles.botaoEnviar}
                                    onClick={handleEnviarCozinha}
                                >
                                    Enviar para a cozinha
                                </button>
                                <button 
                                    className={styles.botaoCancelar}
                                    onClick={handleCancelar}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Aviso - Pedido Vazio */}
            {mostrarModalAviso && (
                <div className={styles.modalOverlay} onClick={fecharModalAviso}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitulo}>Atenção!</h3>
                        <p className={styles.modalTexto}>
                            Adicione pelo menos um item ao pedido!
                        </p>
                        <button 
                            className={styles.modalBtnOk}
                            onClick={fecharModalAviso}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação - Enviar Pedido */}
            {mostrarModalConfirmacao && (
                <div className={styles.modalOverlay} onClick={cancelarEnvio}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitulo}>Confirmar Pedido</h3>
                        <p className={styles.modalTexto}>
                            Deseja enviar este pedido para a cozinha?
                        </p>
                        <div className={styles.modalAcoes}>
                            <button 
                                className={styles.modalBtnConfirmar}
                                onClick={confirmarEnvio}
                            >
                                Confirmar
                            </button>
                            <button 
                                className={styles.modalBtnCancelar}
                                onClick={cancelarEnvio}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Sucesso */}
            {mostrarModalSucesso && (
                <div className={styles.modalOverlay} onClick={fecharModalSucesso}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcone}>✓</div>
                        <h3 className={styles.modalTitulo}>Pedido Enviado!</h3>
                        <p className={styles.modalTexto}>
                            Pedido enviado para a cozinha com sucesso!
                        </p>
                        <button 
                            className={styles.modalBtnOk}
                            onClick={fecharModalSucesso}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Cancelamento */}
            {mostrarModalCancelamento && (
                <div className={styles.modalOverlay} onClick={cancelarCancelamento}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitulo}>Cancelar Pedido</h3>
                        <p className={styles.modalTexto}>
                            Deseja cancelar este pedido? Todos os itens serão perdidos.
                        </p>
                        <div className={styles.modalAcoes}>
                            <button 
                                className={styles.modalBtnConfirmar}
                                onClick={confirmarCancelamento}
                            >
                                Sim, cancelar
                            </button>
                            <button 
                                className={styles.modalBtnCancelar}
                                onClick={cancelarCancelamento}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}