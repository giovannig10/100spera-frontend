'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cardapio');
  const [selectedCategory, setSelectedCategory] = useState('entrada');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete', 'description'
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    { id: 'entrada', name: 'Entrada' },
    { id: 'principal', name: 'Principal' },
    { id: 'bebida', name: 'Bebidas' },
    { id: 'drink', name: 'Drink' },
    { id: 'combos', name: 'Combos' },
  ];
  
  const [menuItems, setMenuItems] = useState([
    { id: 1, nome: 'Batata Frita com Cheddar e Bacon', categoria: 'entrada', descricao: 'Deliciosa batata frita', preco: 52.00, imagem: '/images/batata.jpg' },
    { id: 2, nome: 'Onion Rings (Anéis de Cebola)', categoria: 'entrada', descricao: 'Crocantes anéis', preco: 588.20, imagem: '/images/onion.jpg' },
    { id: 3, nome: 'Mozzarella Sticks (Palitos de Muçarela)', categoria: 'entrada', descricao: 'Queijo empanado', preco: 577.00, imagem: '/images/mozzarella.jpg' },
    { id: 4, nome: 'Super Wings / Chicken Wings', categoria: 'entrada', descricao: 'Asas de frango', preco: 292.00, imagem: '/images/wings.jpg' },
    { id: 5, nome: 'Dadinhos de Tapioca', categoria: 'entrada', descricao: 'Tapioca frita', preco: 18.00, imagem: '/images/tapioca.jpg' },
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, nome: 'Giovanni Gomes', cargo: 'Administrador', codigo: '#12345' },
    { id: 2, nome: 'Gabriela Fernanda', cargo: 'Caixa', codigo: '#67891' },
    { id: 3, nome: 'Julia Martins', cargo: 'Cozinha', codigo: '#23456' },
    { id: 4, nome: 'Pedro Oliveira', cargo: 'Cozinha', codigo: '#78912' },
    { id: 5, nome: 'Vinícius Valverde', cargo: 'Garçom', codigo: '#34567' },
    { id: 6, nome: 'Vitor Lira', cargo: 'Garçom', codigo: '#89123' },
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'entrada',
    descricao: '',
    preco: '',
    imagem: '',
    cargo: '',
    codigo: ''
  });

  const filteredMenuItems = menuItems.filter(item => item.categoria === selectedCategory);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (type === 'edit' && item) {
      setFormData(item);
    } else {
      setFormData({
        nome: '',
        categoria: 'entrada',
        descricao: '',
        preco: '',
        imagem: '',
        cargo: '',
        codigo: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'cardapio') {
      if (modalType === 'add') {
        const newItem = {
          ...formData,
          id: menuItems.length + 1,
          preco: parseFloat(formData.preco)
        };
        setMenuItems([...menuItems, newItem]);
      } else if (modalType === 'edit') {
        setMenuItems(menuItems.map(item => 
          item.id === selectedItem.id ? { ...formData, id: item.id } : item
        ));
      }
    } else {
      if (modalType === 'add') {
        const newEmployee = {
          ...formData,
          id: employees.length + 1
        };
        setEmployees([...employees, newEmployee]);
      } else if (modalType === 'edit') {
        setEmployees(employees.map(emp => 
          emp.id === selectedItem.id ? { ...formData, id: emp.id } : emp
        ));
      }
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (activeTab === 'cardapio') {
      setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
    } else {
      setEmployees(employees.filter(emp => emp.id !== selectedItem.id));
    }
    handleCloseModal();
  };

  const handleOpenDescription = (item) => {
    setSelectedItem(item);
    setModalType('description');
    setShowModal(true);
  };

  return (
    <main className={styles.main}>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboard}>
          {/* Sistema de Abas */}
          <div className={styles.titleDiv}>
            <h1 
              className={`${styles.title} ${activeTab === 'cardapio' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('cardapio')}
            >
              Cardápio
            </h1>
            <h1 
              className={`${styles.title} ${activeTab === 'funcionarios' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('funcionarios')}
            >
              Funcionários
            </h1>
          </div>

          {/* Conteúdo da Aba Cardápio */}
          {activeTab === 'cardapio' && (
            <>
              {/* Filtro de Categorias com Ícones */}
              <div className={styles.categoriesContainer}>
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className={`${styles.categoryIcon} ${selectedCategory === category.id ? styles.activeCategoryIcon : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                ))}
              </div>

              {/* Cabeçalho da Tabela */}
              <div className={styles.tableHeader}>
                <p className={styles.headerItem}>Nome</p>
                <p className={styles.headerItem}>Imagem</p>
                <p className={styles.headerItem}>Descrição</p>
                <p className={styles.headerItem}>Preço</p>
                <p className={styles.headerItem}>Ações</p>
              </div>

              {/* Linhas da Tabela */}
              <div className={styles.tableBody}>
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <p className={styles.itemText}>{item.nome}</p>
                    <div className={styles.itemImage}>
                      <div className={styles.imagePlaceholder}>📷</div>
                    </div>
                    <button className={styles.descriptionButton} onClick={() => handleOpenDescription(item)}>Ver descrição</button>
                    <p className={styles.itemText}>R$ {item.preco.toFixed(2)}</p>
                    <div className={styles.actionsCell}>
                      <button className={styles.editButton} onClick={() => handleOpenModal('edit', item)}>Editar</button>
                      <button className={styles.deleteButton} onClick={() => handleOpenModal('delete', item)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Conteúdo da Aba Funcionários */}
          {activeTab === 'funcionarios' && (
            <>
              {/* Cabeçalho da Tabela Funcionários */}
              <div className={styles.tableHeader}>
                <p className={styles.headerItem}>Nome</p>
                <p className={styles.headerItem}>Cargo</p>
                <p className={styles.headerItem}>Id</p>
                <p className={styles.headerItem}>Código</p>
                <p className={styles.headerItem}>Ações</p>
              </div>

              {/* Linhas da Tabela Funcionários */}
              <div className={styles.tableBody}>
                {employees.map((employee) => (
                  <div key={employee.id} className={styles.tableRow}>
                    <p className={styles.itemText}>{employee.nome}</p>
                    <p className={styles.itemText}>{employee.cargo}</p>
                    <p className={styles.itemText}>{employee.id}</p>
                    <p className={styles.itemText}>{employee.codigo}</p>
                    <div className={styles.actionsCell}>
                      <button className={styles.editButton} onClick={() => handleOpenModal('edit', employee)}>Editar</button>
                      <button className={styles.deleteButton} onClick={() => handleOpenModal('delete', employee)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Botão de Adicionar */}
        <button className={styles.button} onClick={() => handleOpenModal('add')}>
          <p className={styles.buttonText}>Adicionar</p> 
          <span className={styles.emoji}>+</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            
            {/* Modal de Descrição */}
            {modalType === 'description' && (
              <div className={styles.descriptionModal}>
                <h2 className={styles.modalTitle}>Descrição</h2>
                <div className={styles.descriptionContent}>
                  <p className={styles.descriptionText}>{selectedItem?.descricao}</p>
                </div>
                <div className={styles.descriptionActions}>
                  <button className={styles.closeDescriptionButton} onClick={handleCloseModal}>
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {/* Modal de Exclusão */}
            {modalType === 'delete' && (
              <div className={styles.deleteModal}>
                <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
                <p className={styles.deleteMessage}>
                  Tem certeza que deseja excluir <strong>{selectedItem?.nome}</strong>?
                </p>
                <div className={styles.deleteActions}>
                  <button className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
                  <button className={styles.confirmDeleteButton} onClick={handleDelete}>Excluir</button>
                </div>
              </div>
            )}

            {/* Modal de Adicionar/Editar */}
            {(modalType === 'add' || modalType === 'edit') && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.modalTitle}>
                  {modalType === 'add' ? 'Adicionar' : 'Editar'} {activeTab === 'cardapio' ? 'Item' : 'Funcionário'}
                </h2>

                {activeTab === 'cardapio' ? (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nome do Item</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Categoria</label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Descrição</label>
                      <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        rows="3"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Preço (R$)</label>
                      <input
                        type="number"
                        name="preco"
                        value={formData.preco}
                        onChange={handleInputChange}
                        className={styles.input}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>URL da Imagem</label>
                      <input
                        type="text"
                        name="imagem"
                        value={formData.imagem}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="/images/..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nome</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Cargo</label>
                      <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Código</label>
                      <input
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="#12345"
                        required
                      />
                    </div>
                  </>
                )}

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {modalType === 'add' ? 'Adicionar' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}