'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function CaixaPage() {

  
  const [mesas, setMesas] = useState([
    { id: 1, numero: 1, valor: 30.00, status: 'oxupada' },
    { id: 2, numero: 2, valor: 556.00, status: 'ocupada' },
    { id: 3, numero: 3, valor: 250.00, status: 'ocupada' },
    { id: 4, numero: 4, valor: 100.00, status: 'ocupada' },
    { id: 5, numero: 7, valor: 17.00, status: 'ocupada' },
    { id: 6, numero: 8, valor: 143.00, status: 'ocupada' },
    { id: 7, numero: 9, valor: 0, status: 'vazia' },
    { id: 8, numero: 10, valor: 0, status: 'vazia' },
    { id: 9, numero: 13, valor: 78.00, status: 'ocupada' },
    { id: 10, numero: 14, valor: 0, status: 'vazia' },
    { id: 11, numero: 15, valor: 14.00, status: 'ocupada' },
    { id: 12, numero: 16, valor: 59.00, status: 'ocupada' },
    { id: 13, numero: 19, valor: 103.00, status: 'ocupada' },
    { id: 14, numero: 20, valor: 98.00, status: 'ocupada' },
    { id: 15, numero: 21, valor: 420.00, status: 'ocupada' },
    { id: 16, numero: 22, valor: 82.00, status: 'ocupada' },
  ]);

  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [taxaServico, setTaxaServico] = useState(true);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [pedidos] = useState([
    { item: 'Hamburguer Clássico', quantidade: 4, preco: 22.00 },
    { item: 'Coca Cola', quantidade: 4, preco: 8.00 },
  ]);

  const selecionarMesa = (mesa) => {
    if (mesa.status === 'ocupada') {
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

  const confirmarFechamento = () => {
    setMesas(mesas.map(mesa => 
      mesa.id === mesaSelecionada.id 
        ? { ...mesa, valor: 0, status: 'vazia' }
        : mesa
    ));
    setMostrarModalConfirmacao(false);
    setMostrarModalSucesso(true);
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
      <div className={styles.content}>
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
            {mesas.map(mesa => (
              <button
                key={mesa.id}
                className={`${styles.mesa} ${styles[mesa.status]} ${
                  mesaSelecionada?.id === mesa.id ? styles.selecionada : ''
                }`}
                onClick={() => selecionarMesa(mesa)}
                disabled={mesa.status === 'vazia'}
              >
                <span className={styles.mesaNumero}>Mesa {mesa.numero}</span>
                <span className={styles.mesaValor}>
                  R${mesa.valor.toFixed(2).replace('.', ',')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightPanel}>
          {mesaSelecionada ? (
            <div className={styles.fechamento}>
              <h2 className={styles.fechamentoTitulo}>
                Fechamento da conta - Mesa {mesaSelecionada.numero}
              </h2>

              <div className={styles.pedidos}>
                {pedidos.map((pedido, index) => (
                  <div key={index} className={styles.pedidoItem}>
                    {pedido.quantidade}x {pedido.item} – R${pedido.preco.toFixed(2).replace('.', ',')}
                  </div>
                ))}
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
          ) : (
            <div className={styles.semSelecao}>
              <p>Selecione uma mesa ocupada para fechar a conta</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {mostrarModalConfirmacao && (
        <div className={styles.modalOverlay} onClick={cancelarFechamento}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Confirmar Fechamento</h3>
            <p className={styles.modalTexto}>
              Deseja fechar a conta da Mesa {mesaSelecionada?.numero}?
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
