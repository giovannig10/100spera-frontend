"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./garcom.module.css";

export default function Home() {
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [etapa, setEtapa] = useState(null); // 'escolherEstado' ou 'pedido'
  const [estadoMesa, setEstadoMesa] = useState({
    1: "vazia",
    2: "vazia",
    3: "vazia",
    4: "vazia",
    5: "vazia",
    6: "vazia",
    7: "vazia",
    8: "vazia",
    9: "vazia",
    10: "vazia",
    11: "vazia",
    12: "vazia",
    13: "vazia",
    14: "vazia",
    15: "vazia",
    16: "vazia",
    17: "vazia",
    18: "vazia",
    19: "vazia",
    20: "vazia",
    21: "vazia",
    22: "vazia",
    23: "vazia",
    24: "vazia",
  });
  const [categoriaAtiva, setCategoriaAtiva] = useState("entrada");
  const [itensPedido, setItensPedido] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mostrarModalCancelamento, setMostrarModalCancelamento] =
    useState(false);
  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);
  const [produtos, setProdutos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // URL da API
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/100spera";

  // Carregar produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
    carregarEstadoMesas();
  }, []);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);

      // Buscar todas as categorias e todos os pratos
      const [categoriasResponse, pratosResponse] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/dishes`),
      ]);

      console.log("Categorias recebidas:", categoriasResponse.data);
      console.log("Pratos recebidos:", pratosResponse.data);

      // Organizar produtos por categoria
      const produtosOrganizados = {
        entrada: [],
        pratoPrincipal: [],
        bebidas: [],
        drinks: [],
        sobremesas: [],
      };

      const categorias = Array.isArray(categoriasResponse.data)
        ? categoriasResponse.data
        : categoriasResponse.data?.categories ||
          categoriasResponse.data?.data ||
          [];

      const pratos = Array.isArray(pratosResponse.data)
        ? pratosResponse.data
        : pratosResponse.data?.dishes || pratosResponse.data?.data || [];

      console.log("Total de categorias:", categorias.length);
      console.log("Total de pratos:", pratos.length);

      if (!Array.isArray(pratos) || pratos.length === 0) {
        console.error("Nenhum prato encontrado");
        throw new Error("Nenhum prato disponível");
      }

      // Criar mapa de categorias por ID
      const categoriaMap = {};
      categorias.forEach((cat) => {
        categoriaMap[cat.id] = (cat.name || cat.nome || "")
          .toLowerCase()
          .trim();
      });

      console.log("Mapa de categorias:", categoriaMap);

      // Processar cada prato
      pratos.forEach((prato, index) => {
        console.log(`Processando prato ${index}:`, prato);

        const nomeCategoria = categoriaMap[prato.categoryId] || "";

        const produto = {
          id: prato.id || prato._id,
          nome: prato.name || prato.nome,
          preco: parseFloat(prato.price || prato.preco || 0),
          imagem:
            prato.imageUrl ||
            prato.image ||
            prato.imagem ||
            "https://via.placeholder.com/80",
          descricao: prato.description || prato.descricao || "",
        };

        console.log(`Prato "${produto.nome}" da categoria "${nomeCategoria}"`);

        // Mapear para as categorias do frontend
        if (nomeCategoria.includes("entrada") || nomeCategoria === "entradas") {
          produtosOrganizados.entrada.push(produto);
        } else if (
          nomeCategoria.includes("prato") ||
          nomeCategoria.includes("principal")
        ) {
          produtosOrganizados.pratoPrincipal.push(produto);
        } else if (
          nomeCategoria.includes("bebida") &&
          !nomeCategoria.includes("drink")
        ) {
          produtosOrganizados.bebidas.push(produto);
        } else if (nomeCategoria.includes("drink")) {
          produtosOrganizados.drinks.push(produto);
        } else if (nomeCategoria.includes("sobremesa")) {
          produtosOrganizados.sobremesas.push(produto);
        } else {
          console.warn(`Categoria não mapeada: "${nomeCategoria}"`);
        }
      });

      console.log("Produtos organizados final:", produtosOrganizados);
      console.log("Total de produtos por categoria:", {
        entrada: produtosOrganizados.entrada.length,
        pratoPrincipal: produtosOrganizados.pratoPrincipal.length,
        bebidas: produtosOrganizados.bebidas.length,
        drinks: produtosOrganizados.drinks.length,
        sobremesas: produtosOrganizados.sobremesas.length,
      });

      setProdutos(produtosOrganizados);
      setErro(null);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      console.error("Detalhes:", error.response?.data);
      console.error("Status:", error.response?.status);
      setErro(`Erro ao carregar produtos: ${error.message}`);

      // Produtos de exemplo caso a API falhe
      setProdutos({
        entrada: [
          {
            id: 1,
            nome: "Bruschetta",
            preco: 18.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 2,
            nome: "Batata Frita",
            preco: 15.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 11,
            nome: "Coxinha",
            preco: 12.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 12,
            nome: "Pastel",
            preco: 10.0,
            imagem: "https://via.placeholder.com/80",
          },
        ],
        pratoPrincipal: [
          {
            id: 3,
            nome: "Hamburguer Clássico",
            preco: 37.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 4,
            nome: "X-Tudo",
            preco: 52.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 13,
            nome: "Picanha",
            preco: 65.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 14,
            nome: "Frango Grelhado",
            preco: 42.0,
            imagem: "https://via.placeholder.com/80",
          },
        ],
        bebidas: [
          {
            id: 5,
            nome: "Coca Cola Zero",
            preco: 8.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 6,
            nome: "Suco Natural",
            preco: 10.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 15,
            nome: "Água Mineral",
            preco: 5.0,
            imagem: "https://via.placeholder.com/80",
          },
        ],
        drinks: [
          {
            id: 7,
            nome: "Caipirinha",
            preco: 22.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 8,
            nome: "Mojito",
            preco: 25.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 16,
            nome: "Gin Tônica",
            preco: 28.0,
            imagem: "https://via.placeholder.com/80",
          },
        ],
        sobremesas: [
          {
            id: 9,
            nome: "Brownie",
            preco: 12.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 10,
            nome: "Pudim",
            preco: 10.0,
            imagem: "https://via.placeholder.com/80",
          },
          {
            id: 17,
            nome: "Sorvete",
            preco: 15.0,
            imagem: "https://via.placeholder.com/80",
          },
        ],
      });
    } finally {
      setCarregando(false);
    }
  };

  const carregarEstadoMesas = () => {
    // Carregar estado das mesas do localStorage
    const estadoSalvo = localStorage.getItem("estadoMesas");
    if (estadoSalvo) {
      setEstadoMesa(JSON.parse(estadoSalvo));
    }
  };

  const salvarEstadoMesas = (novoEstado) => {
    localStorage.setItem("estadoMesas", JSON.stringify(novoEstado));
  };

  const handleMesaClick = (mesaNumero) => {
    console.log("Mesa clicada:", mesaNumero);
    setMesaSelecionada(mesaNumero);
    setEtapa("escolherEstado");
  };

  const handleEstadoClick = (estado) => {
    const novoEstado = { ...estadoMesa, [mesaSelecionada]: estado };
    setEstadoMesa(novoEstado);
    salvarEstadoMesas(novoEstado);

    if (estado === "ocupada") {
      setEtapa("pedido");
      setItensPedido([]);
      setObservacoes("");
    } else {
      setEtapa(null);
      setMesaSelecionada(null);
    }
  };

  const handleAdicionarItem = (produto) => {
    const itemExistente = itensPedido.find((item) => item.id === produto.id);
    if (itemExistente) {
      setItensPedido(
        itensPedido.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setItensPedido([...itensPedido, { ...produto, quantidade: 1 }]);
    }
  };

  const handleRemoverItem = (produtoId) => {
    setItensPedido(itensPedido.filter((item) => item.id !== produtoId));
  };

  const handleAlterarQuantidade = (produtoId, delta) => {
    setItensPedido(
      itensPedido
        .map((item) => {
          if (item.id === produtoId) {
            const novaQuantidade = item.quantidade + delta;
            if (novaQuantidade <= 0) {
              return null; // Será removido pelo filter
            }
            return { ...item, quantidade: novaQuantidade };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const calcularTotal = () => {
    return itensPedido
      .reduce((total, item) => total + item.preco * item.quantidade, 0)
      .toFixed(2);
  };

  const handleEnviarCozinha = () => {
    if (itensPedido.length === 0) {
      setMostrarModalAviso(true);
      return;
    }
    setMostrarModalConfirmacao(true);
  };

  const confirmarEnvio = async () => {
    try {
      console.log("=== ENVIANDO PEDIDO ===");
      console.log("Mesa:", mesaSelecionada);
      console.log("Itens:", itensPedido);

      // PASSO 1: Criar apenas o pedido (Order) SEM os itens
      const orderData = {
        tableNumber: parseInt(mesaSelecionada),
        userId: 43, // vitor sampaio (garçom) - TODO: pegar do usuário logado
        status: "pendente",
      };

      console.log("PASSO 1: Criando Order:", orderData);
      console.log("URL:", `${API_URL}/orders`);

      const orderResponse = await axios.post(`${API_URL}/orders`, orderData);
      const orderId = orderResponse.data.id;

      console.log("✓ Order criado com ID:", orderId);
      // PASSO 2: Adicionar os itens ao pedido
      console.log("PASSO 2: Adicionando itens ao pedido...");

      const itemsAdicionados = [];
      const itemsComErro = [];

      for (const item of itensPedido) {
        const orderItemData = {
          orderId: parseInt(orderId),
          dishId: parseInt(item.id),
          quantity: parseInt(item.quantidade),
          observations: observacoes || "",
        };

        console.log("Tentando adicionar item:", orderItemData);

        // Tentar diferentes endpoints para criar OrderItems
        let itemCriado = false;
        let ultimoErro = null;

        // Tentativa 1: POST /order-items
        if (!itemCriado) {
          try {
            await axios.post(`${API_URL}/order-items`, orderItemData);
            console.log("✓ Item adicionado via /order-items");
            itemCriado = true;
          } catch (err) {
            ultimoErro = err;
            console.log("Endpoint /order-items não funcionou");
          }
        }

        // Tentativa 2: POST /orderItems (sem hífen)
        if (!itemCriado) {
          try {
            await axios.post(`${API_URL}/orderItems`, orderItemData);
            console.log("✓ Item adicionado via /orderItems");
            itemCriado = true;
          } catch (err) {
            ultimoErro = err;
            console.log("Endpoint /orderItems não funcionou");
          }
        }

        // Tentativa 3: POST /orders/:id/items
        if (!itemCriado) {
          try {
            await axios.post(
              `${API_URL}/orders/${orderId}/items`,
              orderItemData
            );
            console.log("✓ Item adicionado via /orders/:id/items");
            itemCriado = true;
          } catch (err) {
            ultimoErro = err;
            console.log("Endpoint /orders/:id/items não funcionou");
          }
        }

        if (itemCriado) {
          itemsAdicionados.push(item.nome);
        } else {
          itemsComErro.push(item.nome);
          console.error(
            "✗ Não foi possível adicionar item:",
            item.nome,
            ultimoErro
          );
        }
      }

      console.log(
        `Items adicionados: ${itemsAdicionados.length}/${itensPedido.length}`
      );

      setMostrarModalConfirmacao(false);

      // Mostrar resultado
      if (itemsComErro.length > 0) {
        alert(
          `⚠️ Pedido criado (ID: ${orderId}), mas com problemas:\n\n` +
            `✓ Items adicionados: ${itemsAdicionados.length}\n` +
            `✗ Items com erro: ${itemsComErro.length}\n\n` +
            `Items não adicionados:\n${itemsComErro.join(", ")}\n\n` +
            `O backend não possui endpoint para criar OrderItems.\n` +
            `Você precisa criar esse endpoint no backend.`
        );
      }

      setMostrarModalSucesso(true);
    } catch (error) {
      console.error("✗ ERRO AO CRIAR PEDIDO");
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      let mensagemErro = "Erro desconhecido ao criar pedido";

      if (error.response) {
        const errorData = error.response.data;
        mensagemErro =
          errorData?.error ||
          errorData?.message ||
          `Erro ${error.response.status}: ${error.response.statusText}`;

        if (error.response.status === 404) {
          mensagemErro =
            "Endpoint não encontrado. Verifique se o backend está rodando.";
        } else if (error.response.status === 500) {
          // Mensagem mais específica para erro 500
          const erroBackend = errorData?.error || "";

          if (
            erroBackend.includes("foreign key constraint") ||
            erroBackend.includes("tableNumber")
          ) {
            mensagemErro = `A mesa ${mesaSelecionada} não existe no banco de dados.\n\nSolução: Crie a mesa no banco ou ajuste o número da mesa.`;
          } else if (erroBackend.includes("userId")) {
            mensagemErro =
              "O usuário com ID 1 não existe no banco de dados.\n\nSolução: Crie o usuário ou ajuste o userId no código.";
          } else {
            mensagemErro = `Erro no servidor:\n${erroBackend}\n\nVerifique:\n• Mesa ${mesaSelecionada} existe no banco?\n• Usuário ID 1 existe no banco?\n• Backend está configurado corretamente?`;
          }
        }
      } else if (error.request) {
        mensagemErro =
          "Servidor não respondeu.\n\nVerifique:\n• Backend está rodando em http://localhost:4000\n• Não há bloqueio de firewall";
      } else {
        mensagemErro = error.message;
      }

      alert(`❌ Erro ao criar pedido:\n\n${mensagemErro}`);
      setMostrarModalConfirmacao(false);
    }
  };

  const cancelarEnvio = () => {
    setMostrarModalConfirmacao(false);
  };

  const fecharModalSucesso = () => {
    setMostrarModalSucesso(false);
    setEtapa(null);
    setMesaSelecionada(null);
    setItensPedido([]);
    setObservacoes("");
  };

  const handleCancelar = () => {
    setMostrarModalCancelamento(true);
  };

  const confirmarCancelamento = () => {
    setMostrarModalCancelamento(false);
    setEtapa(null);
    setMesaSelecionada(null);
    setItensPedido([]);
    setObservacoes("");
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
    if (estado === "ocupada")
      return `${styles.mesaButton} ${styles.mesaOcupada}`;
    if (estado === "vazia") return `${styles.mesaButton} ${styles.mesaVazia}`;
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
          {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={getMesaEstilo(num)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMesaClick(num);
              }}
              type="button"
            >
              Mesa {num}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Escolha de Estado */}
      {etapa === "escolherEstado" && (
        <div className={styles.modalOverlay} onClick={() => setEtapa(null)}>
          <div
            className={styles.modalEstado}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitulo}>Mesa {mesaSelecionada}</h3>
            <p className={styles.modalSubtitulo}>Escolha o estado da mesa</p>
            <div className={styles.botoesEstado}>
              <button
                className={styles.botaoEstadoModal}
                onClick={() => handleEstadoClick("ocupada")}
              >
                Ocupada
              </button>
              <button
                className={styles.botaoEstadoModal}
                onClick={() => handleEstadoClick("vazia")}
              >
                Vazia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pedido */}
      {etapa === "pedido" && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalPedidoGrande}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.btnFecharModal} onClick={handleCancelar}>
              ✕
            </button>

            <h3 className={styles.modalTituloPedido}>
              Mesa {mesaSelecionada} - Fazer Pedido
            </h3>

            <div className={styles.modalConteudo}>
              <div className={styles.modalProdutos}>
                {/* Abas de categoria */}
                <div className={styles.abasCategoria}>
                  <button
                    className={
                      categoriaAtiva === "entrada"
                        ? styles.abaAtiva
                        : styles.aba
                    }
                    onClick={() => setCategoriaAtiva("entrada")}
                  >
                    Entradas
                  </button>
                  <button
                    className={
                      categoriaAtiva === "pratoPrincipal"
                        ? styles.abaAtiva
                        : styles.aba
                    }
                    onClick={() => setCategoriaAtiva("pratoPrincipal")}
                  >
                    Prato Principal
                  </button>
                  <button
                    className={
                      categoriaAtiva === "sobremesas"
                        ? styles.abaAtiva
                        : styles.aba
                    }
                    onClick={() => setCategoriaAtiva("sobremesas")}
                  >
                    Sobremesas
                  </button>
                  <button
                    className={
                      categoriaAtiva === "bebidas"
                        ? styles.abaAtiva
                        : styles.aba
                    }
                    onClick={() => setCategoriaAtiva("bebidas")}
                  >
                    Bebidas
                  </button>
                  <button
                    className={
                      categoriaAtiva === "drinks" ? styles.abaAtiva : styles.aba
                    }
                    onClick={() => setCategoriaAtiva("drinks")}
                  >
                    Drinks
                  </button>
                </div>

                {/* Cards de produtos */}
                <div className={styles.produtosListaModal}>
                  {carregando ? (
                    <div className={styles.loadingContainer}>
                      <p className={styles.loadingText}>
                        Carregando produtos...
                      </p>
                    </div>
                  ) : erro ? (
                    <div className={styles.erroContainer}>
                      <p className={styles.erroText}>{erro}</p>
                      <button
                        className={styles.btnRecarregar}
                        onClick={carregarProdutos}
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : produtos[categoriaAtiva] &&
                    produtos[categoriaAtiva].length > 0 ? (
                    produtos[categoriaAtiva].map((produto) => (
                      <div
                        key={produto.id}
                        className={styles.produtoCardModal}
                        onClick={() => handleAdicionarItem(produto)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            produto.imagem || "https://via.placeholder.com/80"
                          }
                          alt={produto.nome}
                          className={styles.produtoImagemModal}
                        />
                        <div className={styles.produtoInfoModal}>
                          <h4 className={styles.produtoNomeModal}>
                            {produto.nome}
                          </h4>
                          <span className={styles.produtoPrecoModal}>
                            R$ {Number(produto.preco).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.semProdutos}>
                      <p className={styles.semProdutosText}>
                        Nenhum produto disponível nesta categoria
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Painel de Resumo do Pedido */}
              <div className={styles.modalResumo}>
                <h4 className={styles.subtituloModal}>Itens do Pedido</h4>

                <div className={styles.itensPedidoModal}>
                  {itensPedido.length === 0 ? (
                    <p className={styles.itemTextoVazio}>
                      Nenhum item adicionado
                    </p>
                  ) : (
                    itensPedido.map((item) => (
                      <div key={item.id} className={styles.itemPedidoContainer}>
                        <div className={styles.itemPedidoInfo}>
                          <span className={styles.itemTexto}>{item.nome}</span>
                          <span className={styles.itemPreco}>
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </span>
                        </div>
                        <div className={styles.itemPedidoControles}>
                          <button
                            className={styles.btnQuantidade}
                            onClick={() => handleAlterarQuantidade(item.id, -1)}
                          >
                            -
                          </button>
                          <span className={styles.quantidadeTexto}>
                            {item.quantidade}
                          </span>
                          <button
                            className={styles.btnQuantidade}
                            onClick={() => handleAlterarQuantidade(item.id, 1)}
                          >
                            +
                          </button>
                          <button
                            className={styles.btnRemover}
                            onClick={() => handleRemoverItem(item.id)}
                            title="Remover item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.observacoesModal}>
                  <label className={styles.subtituloModal}>Observações:</label>
                  <textarea
                    className={styles.textareaObsModal}
                    placeholder="Digite aqui observações..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>

                <div className={styles.totalPedidoModal}>
                  <span className={styles.textoTotalModal}>
                    Total: R$ {calcularTotal()}
                  </span>
                </div>

                <div className={styles.botoesPedidoModal}>
                  <button
                    className={styles.botaoEnviarModal}
                    onClick={handleEnviarCozinha}
                  >
                    Enviar para a cozinha
                  </button>
                  <button
                    className={styles.botaoCancelarModal}
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Aviso - Pedido Vazio */}
      {mostrarModalAviso && (
        <div className={styles.modalOverlay} onClick={fecharModalAviso}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Atenção!</h3>
            <p className={styles.modalTexto}>
              Adicione pelo menos um item ao pedido!
            </p>
            <button className={styles.modalBtnOk} onClick={fecharModalAviso}>
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
            <button className={styles.modalBtnOk} onClick={fecharModalSucesso}>
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
  );
}