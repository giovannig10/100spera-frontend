"use client"; // Marca como Componente Cliente

import React from 'react';
import styles from './modal.module.css'; 

const Modal = ({ isOpen, onClose, children, title }) => {
    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    return (
        // Overlay do modal (fundo escuro)
        // Clicar no overlay fecha o modal
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* Conteúdo do modal */}
            {/* O e.stopPropagation() impede que o clique no conteúdo feche o modal */}
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {title && <h3 className={styles.modalTitle}>{title}</h3>}
                
                {/* O 'children' é onde você vai passar o conteúdo específico (descrição, formulário, etc.) */}
                <div className={styles.modalBody}>
                    {children}
                </div>
                
                <button onClick={onClose} className={styles.modalCloseButton}>Fechar</button>
            </div>
        </div>
    );
};

export default Modal;