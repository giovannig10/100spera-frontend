'use client';

import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    carregarMesas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      
      const pedidosDaMesa = orders.filter(
        order => order.tableNumber === tableNumber && order.status === 'pendente'
      );
      
      if (pedidosDaMesa.length === 0) {
        setPedidos([]);
        return;
      }
      
      const itemsResponse = await fetch(`${API_BASE_URL}/order-items`);
      const allItems = await itemsResponse.json();
      
      const todosItens = [];
      pedidosDaMesa.forEach(order => {
        const itensDoPedido = allItems.filter(item => item.orderId === order.id);
        todosItens.push(...itensDoPedido);
      });
      
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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    const margemEsquerda = 20;
    const margemDireita = 20;
    const larguraUtil = pageWidth - margemEsquerda - margemDireita;
    let yPosition = 20;
    
    const corPrimaria = [68, 93, 66];
    const corSecundaria = [83, 125, 93];
    const corTerciaria = [103, 139, 102];
    const corQuinaria = [158, 188, 138];
    const corFundoClaro = [208, 227, 195];
    const corTexto = [33, 33, 33];
    const corTextoClaro = [97, 97, 97];
    const corLinha = [231, 231, 231];
    const corFundoTabela = [245, 250, 243];
    
    const logo = new Image();
    logo.src = '/images/logo.png';
    try {
      const logoWidth = 40;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logo, 'PNG', logoX, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 10;
    } catch (error) {
      console.log('Logo não carregada, continuando sem logo');
      yPosition += 5;
    }
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corPrimaria);
    doc.text('100SPERA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corTextoClaro);
    doc.text('Restaurante & Choperia', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    doc.setDrawColor(...corPrimaria);
    doc.setLineWidth(0.8);
    doc.line(margemEsquerda, yPosition, pageWidth - margemDireita, yPosition);
    
    yPosition += 12;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corTexto);
    doc.text('RECIBO DE PAGAMENTO', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 12;
    doc.setDrawColor(...corLinha);
    doc.setFillColor(...corFundoClaro);
    doc.roundedRect(margemEsquerda, yPosition, larguraUtil, 18, 2, 2, 'FD');
    
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corTextoClaro);
    
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    doc.text(`Data: ${dataFormatada}`, margemEsquerda + 5, yPosition);
    doc.text(`Hora: ${horaFormatada}`, pageWidth - margemDireita - 5, yPosition, { align: 'right' });
    
    yPosition += 7;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corPrimaria);
    doc.text(`Mesa: ${mesaSelecionada.number}`, margemEsquerda + 5, yPosition);
    
    yPosition += 18;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corTexto);
    doc.text('Itens Consumidos', margemEsquerda, yPosition);
    
    yPosition += 3;
    doc.setDrawColor(...corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, yPosition, margemEsquerda + 45, yPosition);
    
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corTextoClaro);
    doc.text('QTD', margemEsquerda + 2, yPosition);
    doc.text('ITEM', margemEsquerda + 15, yPosition);
    doc.text('PREÇO UNIT.', pageWidth - margemDireita - 55, yPosition, { align: 'right' });
    doc.text('TOTAL', pageWidth - margemDireita - 2, yPosition, { align: 'right' });
    
    yPosition += 2;
    doc.setDrawColor(...corLinha);
    doc.setLineWidth(0.3);
    doc.line(margemEsquerda, yPosition, pageWidth - margemDireita, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corTexto);
    doc.setFontSize(9);
    
    pedidos.forEach((pedido, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(...corFundoTabela);
        doc.rect(margemEsquerda, yPosition - 5, larguraUtil, 9, 'F');
      }
      
      doc.text(String(pedido.quantidade), margemEsquerda + 5, yPosition, { align: 'center' });
      doc.text(pedido.item.substring(0, 35), margemEsquerda + 15, yPosition);
      doc.text(`R$ ${pedido.preco.toFixed(2).replace('.', ',')}`, pageWidth - margemDireita - 55, yPosition, { align: 'right' });
      doc.text(`R$ ${(pedido.quantidade * pedido.preco).toFixed(2).replace('.', ',')}`, pageWidth - margemDireita - 2, yPosition, { align: 'right' });
      
      yPosition += 7;
      
      if (pedido.observacoes) {
        doc.setFontSize(8);
        doc.setTextColor(...corTextoClaro);
        doc.setFont('helvetica', 'italic');
        doc.text(`Obs: ${pedido.observacoes}`, margemEsquerda + 15, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...corTexto);
        doc.setFontSize(9);
        yPosition += 6;
      }
      
      yPosition += 2;
    });
    
    yPosition += 5;
    doc.setDrawColor(...corPrimaria);
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, yPosition, pageWidth - margemDireita, yPosition);
    
    yPosition += 10;
    const colValores = pageWidth - margemDireita - 2;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corTexto);
    doc.text('Subtotal:', margemEsquerda, yPosition);
    doc.text(`R$ ${calcularSubtotal().toFixed(2).replace('.', ',')}`, colValores, yPosition, { align: 'right' });
    
    if (taxaServico) {
      yPosition += 7;
      doc.text('Taxa de Serviço (10%):', margemEsquerda, yPosition);
      doc.text(`R$ ${calcularTaxa().toFixed(2).replace('.', ',')}`, colValores, yPosition, { align: 'right' });
    }
    
    yPosition += 10;
    doc.setDrawColor(...corSecundaria);
    doc.setFillColor(...corPrimaria);
    doc.roundedRect(margemEsquerda, yPosition - 5, larguraUtil, 14, 2, 2, 'FD');
    
    yPosition += 4;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL PAGO:', margemEsquerda + 5, yPosition);
    doc.text(`R$ ${calcularTotal().toFixed(2).replace('.', ',')}`, colValores - 5, yPosition, { align: 'right' });
    
    yPosition = pageHeight - 40;
    
    doc.setDrawColor(...corPrimaria);
    doc.setFillColor(...corFundoClaro);
    doc.roundedRect(margemEsquerda, yPosition, larguraUtil, 16, 2, 2, 'FD');
    
    yPosition += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...corPrimaria);
    doc.text('Obrigado pela preferência!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corTextoClaro);
    doc.text('Volte sempre ao 100SPERA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(8);
    doc.setTextColor(...corTextoClaro);
    doc.text('www.100spera.com.br | (11) 3456-7890', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 7;
    doc.setFontSize(7);
    doc.setTextColor(...corTextoClaro);
    const numeroDoc = `DOC: ${mesaSelecionada.number}-${new Date().getTime()}`;
    doc.text(numeroDoc, pageWidth / 2, yPosition, { align: 'center' });
    
    const nomeArquivo = `recibo_100spera_mesa${mesaSelecionada.number}_${new Date().getTime()}.pdf`;
    doc.save(nomeArquivo);
  };

  const confirmarFechamento = async () => {
    if (!mesaSelecionada) return;
    
    try {
      console.log('Iniciando fechamento da mesa:', mesaSelecionada.number);
      
      gerarReciboPDF();
      
      const ordersResponse = await fetch(`${API_BASE_URL}/orders`);
      const orders = await ordersResponse.json();
      
      console.log('Todos os pedidos:', orders);
      
      const pedidosDaMesa = orders.filter(
        order => order.tableNumber === mesaSelecionada.number && order.status === 'pendente'
      );
      
      console.log('Pedidos da mesa para finalizar:', pedidosDaMesa);
      
      for (const order of pedidosDaMesa) {
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
        
        const itemsResponse = await fetch(`${API_BASE_URL}/order-items`);
        const allItems = await itemsResponse.json();
        
        const itensDoPedido = allItems.filter(item => item.orderId === order.id);
        
        for (const item of itensDoPedido) {
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
      
      setMostrarModalConfirmacao(false);
      setMesaSelecionada(null);
      
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
      </div>

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
