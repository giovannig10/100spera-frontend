"use client";

import React from 'react';
import styles from './modal.module.css'; 

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
    
        <div className={styles.modalOverlay} onClick={onClose}>
        
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {title && <h3 className={styles.modalTitle}>{title}</h3>}
                
            
                <div className={styles.modalBody}>
                    {children}
                </div>
                
                <button onClick={onClose} className={styles.modalCloseButton}>Fechar</button>
            </div>
        </div>
    );
};

export default Modal;