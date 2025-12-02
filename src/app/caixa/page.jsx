'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import jsPDF from 'jspdf';

const API_BASE_URL = 'http://localhost:4000/100spera';

export default function CaixaPage() {
  const [mesas, setMesas] = useState([]);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [taxaServico, setTaxaServico] = useState(true);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar mesas da API
  useEffect(() => {
    carregarMesas();
  }, []);

  // Carregar pedidos quando uma mesa for selecionada
  useEffect(() => {
    if (mesaSelecionada) {
      carregarPedidosDaMesa(mesaSelecionada.number);
    } else {
      setPedidos([]);
    }
  }, [mesaSelecionada]);

  const carregarMesas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tables`);
      const tables = await response.json();
      
      console.log('Mesas recebidas da API:', tables);
      
      // Processar mesas com seus valores
      const mesasComValores = await Promise.all(
        tables.map(async (table) => {
          const valor = await calcularValorMesa(table.number);
          return {
            id: table.number,
            number: table.number,
            valor: valor,
            status: table.status === 'disponível' ? 'disponível' : 'ocupada'
          };
        })
      );
      
      console.log('Mesas processadas:', mesasComValores);
      setMesas(mesasComValores);
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularValorMesa = async (tableNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const orders = await response.json();
      
      // Filtrar pedidos pendentes da mesa
      const pedidosDaMesa = orders.filter(
        order => order.tableNumber === tableNumber && order.status === 'pendente'
      );
      
      if (pedidosDaMesa.length === 0) return 0;
      
      // Buscar order-items de cada pedido
      let valorTotal = 0;
      for (const order of pedidosDaMesa) {
        const itemsResponse = await fetch(`${API_BASE_URL}/order-items`);
        const allItems = await itemsResponse.json();
        
        const itensDoPedido = allItems.filter(item => item.orderId === order.id);
        
        itensDoPedido.forEach(item => {
          valorTotal += item.dish.price * item.quantity;
        });
      }
      
      return valorTotal;
    } catch (error) {
      console.error('Erro ao calcular valor da mesa:', error);
      return 0;
    }
  };

  const carregarPedidosDaMesa = async (tableNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const orders = await response.json();
      
      // Filtrar pedidos pendentes da mesa
      const pedidosDaMesa = orders.filter(
        order => order.tableNumber === tableNumber && order.status === 'pendente'
      );
      
      if (pedidosDaMesa.length === 0) {
        setPedidos([]);
        return;
      }
      
      // Buscar todos os order-items dos pedidos
      const itemsResponse = await fetch(`${API_BASE_URL}/order-items`);
      const allItems = await itemsResponse.json();
      
      const todosItens = [];
      pedidosDaMesa.forEach(order => {
        const itensDoPedido = allItems.filter(item => item.orderId === order.id);
        todosItens.push(...itensDoPedido);
      });
      
      // Formatar os itens para exibição
      const pedidosFormatados = todosItens.map(item => ({
        item: item.dish.name,
        quantidade: item.quantity,
        preco: item.dish.price,
        observacoes: item.observations
      }));
      
      setPedidos(pedidosFormatados);
    } catch (error) {
      console.error('Erro ao carregar pedidos da mesa:', error);
      setPedidos([]);
    }
  };

  const selecionarMesa = (mesa) => {
    // Permitir selecionar mesa se tiver valor > 0 (tem pedidos pendentes)
    if (mesa.valor > 0) {
      setMesaSelecionada(mesa);
    }
  };

  const calcularSubtotal = () => {
    if (!mesaSelecionada) return 0;
    return mesaSelecionada.valor;
  };

  const calcularTaxa = () => {
    if (!taxaServico) return 0;
    return calcularSubtotal() * 0.10;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularTaxa();
  };

  const fecharConta = () => {
    if (!mesaSelecionada) return;
    setMostrarModalConfirmacao(true);
  };

  const gerarReciboPDF = () => {
    if (!mesaSelecionada) return;
    
    const doc = new jsPDF();
    
    // Configurações do PDF
    const margemEsquerda = 20;
    let yPosition = 20;
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('RECIBO DE PAGAMENTO', margemEsquerda, yPosition);
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margemEsquerda, yPosition);
    yPosition += 7;
    doc.text(`Hora: ${new Date().toLocaleTimeString('pt-BR')}`, margemEsquerda, yPosition);
    
    // Informações da mesa
    yPosition += 15;
    doc.setFontSize(14);
    doc.text(`Mesa: ${mesaSelecionada.number}`, margemEsquerda, yPosition);
    
    // Linha separadora
    yPosition += 10;
    doc.line(margemEsquerda, yPosition, 190, yPosition);
    
    // Itens do pedido
    yPosition += 10;
    doc.setFontSize(12);
    doc.text('Itens Consumidos:', margemEsquerda, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    pedidos.forEach((pedido) => {
      doc.text(
        `${pedido.quantidade}x ${pedido.item}`,
        margemEsquerda + 5,
        yPosition
      );
      doc.text(
        `R$ ${(pedido.quantidade * pedido.preco).toFixed(2).replace('.', ',')}`,
        150,
        yPosition
      );
      yPosition += 7;
    });
    
    // Linha separadora
    yPosition += 5;
    doc.line(margemEsquerda, yPosition, 190, yPosition);
    
    // Totais
    yPosition += 10;
    doc.setFontSize(11);
    doc.text('Subtotal:', margemEsquerda, yPosition);
    doc.text(
      `R$ ${calcularSubtotal().toFixed(2).replace('.', ',')}`,
      150,
      yPosition
    );
    
    if (taxaServico) {
      yPosition += 7;
      doc.text('Taxa de Serviço (10%):', margemEsquerda, yPosition);
      doc.text(
        `R$ ${calcularTaxa().toFixed(2).replace('.', ',')}`,
        150,
        yPosition
      );
    }
    
    // Linha separadora
    yPosition += 5;
    doc.line(margemEsquerda, yPosition, 190, yPosition);
    
    // Total
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL PAGO:', margemEsquerda, yPosition);
    doc.text(
      `R$ ${calcularTotal().toFixed(2).replace('.', ',')}`,
      150,
      yPosition
    );
    
    // Rodapé
    yPosition += 20;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Obrigado pela preferência!', margemEsquerda, yPosition);
    yPosition += 7;
    doc.text('Volte sempre!', margemEsquerda, yPosition);
    
    // Salvar o PDF
    const nomeArquivo = `recibo_mesa_${mesaSelecionada.number}_${new Date().getTime()}.pdf`;
    doc.save(nomeArquivo);
  };

  const confirmarFechamento = async () => {
    if (!mesaSelecionada) return;
    
    try {
      console.log('Iniciando fechamento da mesa:', mesaSelecionada.number);
      
      // Gerar o recibo em PDF antes de fechar a conta
      gerarReciboPDF();
      
      // Buscar pedidos da mesa para atualizar o status
      const ordersResponse = await fetch(`${API_BASE_URL}/orders`);
      const orders = await ordersResponse.json();
      
      console.log('Todos os pedidos:', orders);
      
      const pedidosDaMesa = orders.filter(
        order => order.tableNumber === mesaSelecionada.number && order.status === 'pendente'
      );
      
      console.log('Pedidos da mesa para finalizar:', pedidosDaMesa);
      
      // Atualizar status de cada pedido para 'pago' e zerar valores dos itens
      for (const order of pedidosDaMesa) {
        // Atualizar status do pedido para 'pago'
        const response = await fetch(`${API_BASE_URL}/orders/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            tableNumber: order.tableNumber,
            status: 'pago',
            userId: order.userId
          })
        });
        console.log(`Pedido ${order.id} atualizado para 'pago':`, response.ok);
        
        // Buscar e zerar os valores dos order-items deste pedido
        const itemsResponse = await fetch(`${API_BASE_URL}/order-items`);
        const allItems = await itemsResponse.json();
        
        const itensDoPedido = allItems.filter(item => item.orderId === order.id);
        
        for (const item of itensDoPedido) {
          // Zerar o valor do item (definir preço como 0)
          await fetch(`${API_BASE_URL}/order-items/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              orderId: item.orderId,
              dishId: item.dishId,
              quantity: item.quantity,
              observations: item.observations
            })
          });
          console.log(`Item ${item.id} zerado`);
        }
      }
      
      // Atualizar status da mesa para disponível
      const mesaResponse = await fetch(`${API_BASE_URL}/tables/${mesaSelecionada.number}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          number: mesaSelecionada.number,
          status: 'disponível' 
        })
      });
      
      console.log('Mesa atualizada:', mesaResponse.ok);
      
      // Fechar modal e limpar seleção antes de recarregar
      setMostrarModalConfirmacao(false);
      setMesaSelecionada(null);
      
      // Recarregar mesas após um pequeno delay
      setTimeout(async () => {
        await carregarMesas();
        setMostrarModalSucesso(true);
      }, 300);
      
    } catch (error) {
      console.error('Erro ao fechar conta:', error);
      alert('Erro ao fechar a conta. Tente novamente.');
    }
  };

  const cancelarFechamento = () => {
    setMostrarModalConfirmacao(false);
  };

  const fecharModalSucesso = () => {
    setMostrarModalSucesso(false);
    setMesaSelecionada(null);
  };

  const cancelar = () => {
    setMesaSelecionada(null);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${mesaSelecionada ? styles.withDrawer : ''}`}>
        <div className={styles.leftPanel}>
          <div className={styles.legenda}>
            <span className={styles.legendaTitle}>Mapa de Mesas</span>
            <div className={styles.legendaItens}>
              <span className={styles.legendaItem}>
                <span className={`${styles.legendaCor} ${styles.ocupada}`}></span>
                Ocupada
              </span>
              <span className={styles.legendaItem}>
                <span className={`${styles.legendaCor} ${styles.vazia}`}></span>
                Vazia
              </span>
              <span className={styles.legendaItem}>
                <span className={`${styles.legendaCor} ${styles.selecionada}`}></span>
                Selecionada
              </span>
            </div>
          </div>

          <div className={styles.mapaMesas}>
            {loading ? (
              <div className={styles.loading}>Carregando mesas...</div>
            ) : mesas.length === 0 ? (
              <div className={styles.loading}>Nenhuma mesa encontrada</div>
            ) : (
              mesas.map(mesa => {
                const temPedidos = mesa.valor > 0;
                const statusVisual = temPedidos ? 'ocupada' : 'disponível';
                
                return (
                  <button
                    key={mesa.id}
                    className={`${styles.mesa} ${styles[statusVisual]} ${
                      mesaSelecionada?.id === mesa.id ? styles.selecionada : ''
                    }`}
                    onClick={() => selecionarMesa(mesa)}
                    disabled={!temPedidos}
                  >
                    <span className={styles.mesaNumero}>Mesa {mesa.number}</span>
                    <span className={styles.mesaValor}>
                      R${mesa.valor.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Drawer lateral dentro do layout (mapa diminui mas continua visível) */}
        {mesaSelecionada && (
          <div className={`${styles.drawer} ${mesaSelecionada ? styles.drawerOpen : ''}`}>
            <div className={styles.fechamento}>
              <h2 className={styles.fechamentoTitulo}>
                Fechamento da conta - Mesa {mesaSelecionada.number}
              </h2>

              <div className={styles.pedidos}>
                {pedidos.length === 0 ? (
                  <div className={styles.pedidoItem}>Carregando pedidos...</div>
                ) : (
                  pedidos.map((pedido, index) => (
                    <div key={index} className={styles.pedidoItem}>
                      {pedido.quantidade}x {pedido.item} – R${pedido.preco.toFixed(2).replace('.', ',')}
                      {pedido.observacoes && (
                        <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                          Obs: {pedido.observacoes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className={styles.totais}>
                <div className={styles.subtotal}>
                  <span>Subtotal:</span>
                  <span>R${calcularSubtotal().toFixed(2).replace('.', ',')}</span>
                </div>

                <div className={styles.taxaContainer}>
                  <label className={styles.taxaLabel}>
                    <span>Taxa de serviço (10%)</span>
                    <input
                      type="checkbox"
                      checked={taxaServico}
                      onChange={(e) => setTaxaServico(e.target.checked)}
                      className={styles.taxaCheckbox}
                    />
                  </label>
                  {taxaServico && (
                    <span className={styles.taxaValor}>
                      +R${calcularTaxa().toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <div className={styles.total}>
                  <span>Total a pagar:</span>
                  <span className={styles.totalValor}>
                    R${calcularTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              </div>
              <div className={styles.acoesBelow}>
                <div className={styles.acoes}>
                  <button 
                    className={styles.btnFechar}
                    onClick={fecharConta}
                  >
                    Fechar Conta
                  </button>
                  <button 
                    className={styles.btnCancelar}
                    onClick={cancelar}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}
        {/* Quando nenhuma mesa está selecionada, não renderiza placeholder à direita */}
      </div>

      {/* Modal de Confirmação */}
      {mostrarModalConfirmacao && (
        <div className={styles.modalOverlay} onClick={cancelarFechamento}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Confirmar Fechamento</h3>
            <p className={styles.modalTexto}>
              Deseja fechar a conta da Mesa {mesaSelecionada?.number}?
            </p>
            <div className={styles.modalValor}>
              Total: R${calcularTotal().toFixed(2).replace('.', ',')}
            </div>
            <div className={styles.modalAcoes}>
              <button 
                className={styles.modalBtnConfirmar}
                onClick={confirmarFechamento}
              >
                Confirmar
              </button>
              <button 
                className={styles.modalBtnCancelar}
                onClick={cancelarFechamento}
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
            <h3 className={styles.modalTitulo}>Conta Fechada!</h3>
            <p className={styles.modalTexto}>
              A conta foi fechada com sucesso.
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
    </div>
  );
}
