"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

const API_URL = "http://localhost:4000/100spera";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    accessCode: "",
    categoryId: null,
    description: "",
    imageUrl: "",
    name: "",
    price: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCodes, setVisibleCodes] = useState({});
  const [newResetCode, setNewResetCode] = useState(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [categoriesData, dishesData, usersData] = await Promise.all([
        fetch(`${API_URL}/categories`).then((res) => res.json()),
        fetch(`${API_URL}/dishes`).then((res) => res.json()),
        fetch(`${API_URL}/users`).then((res) => res.json()),
      ]);

      setCategories(categoriesData);
      setMenuItems(dishesData);
      setEmployees(usersData);

      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (err) {
      alert("Erro ao carregar dados. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleResetCode = async (employee) => {
    setSelectedItem(employee);
    setModalType("confirmReset");
    setShowModal(true);
  };

  const confirmResetCode = async () => {
    try {
      const response = await fetch(
        `${API_URL}/users/reset-code/${selectedItem.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao resetar código");
      }

      const data = await response.json();
      setNewResetCode(data.newAccessCode);
      setModalType("showNewCode");
      await loadInitialData();
    } catch (error) {
      console.error('Erro ao resetar código:', error);
      alert(
        "Erro ao resetar código de acesso. Verifique se o backend está rodando."
      );
      handleCloseModal();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Código copiado para a área de transferência!");
      })
      .catch(err => {
      console.error('Erro ao copiar:', err);
        alert("Erro ao copiar código");
      });
  };

  const toggleCodeVisibility = async (userId) => {
    if (visibleCodes[userId]) {
      setVisibleCodes((prev) => ({ ...prev, [userId]: null }));
    } else {
      try {
        const response = await fetch(`${API_URL}/users/decrypt/${userId}`);
        if (!response.ok) {
          throw new Error("Endpoint não encontrado");
        }
        const data = await response.json();
        setVisibleCodes((prev) => ({
          ...prev,
          [userId]: data.plainAccessCode,
        }));
      } catch (error) {
        alert(
          "Erro: O endpoint /users/decrypt/:id não está implementado no backend"
        );
      }
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (type === "edit" && item) {
      if (activeTab === "cardapio") {
        setFormData({
          name: item.name,
          categoryId: item.categoryId,
          description: item.description || "",
          price: item.price.toString(),
          imageUrl: item.imageUrl || "",
        });
      } else {
        setFormData({
          name: item.name,
          type: item.type,
          accessCode: item.accessCode,
        });
      }
    } else {
      if (activeTab === "cardapio") {
        setFormData({
          name: "",
          categoryId: selectedCategory,
          description: "",
          price: "",
          imageUrl: "",
        });
      } else {
        setFormData({
          name: "",
          type: "",
          accessCode: "",
        });
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType("");
    setNewResetCode(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "cardapio") {
        const dishData = {
          name: formData.name,
          categoryId: parseInt(formData.categoryId),
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || null,
        };

        if (modalType === "add") {
          const response = await fetch(`${API_URL}/dishes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dishData),
          });
          if (!response.ok) {
            throw new Error('Erro ao criar item');
          }
          const newDish = await response.json();
          setMenuItems([...menuItems, newDish]);
        } else if (modalType === "edit") {
          const response = await fetch(`${API_URL}/dishes/${selectedItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dishData),
          });
          if (!response.ok) {
            throw new Error('Erro ao editar item');
          }
          setMenuItems(
            menuItems.map((item) =>
              item.id === selectedItem.id ? { ...item, ...dishData } : item
            )
          );
        }
      } else {
        const userData = {
          name: formData.name,
          type: formData.type,
          accessCode: formData.accessCode,
        };

        if (modalType === "add") {
          const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          if (!response.ok) {
            const errorData = await response.text();
            alert(`Erro ao criar funcionário: ${errorData}`);
            return;
          }
          const newUser = await response.json();
          setEmployees([...employees, newUser]);
        } else if (modalType === "edit") {
          const response = await fetch(`${API_URL}/users/${selectedItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          if (!response.ok) {
            throw new Error('Erro ao editar funcionário');
          }
          setEmployees(
            employees.map((emp) =>
              emp.id === selectedItem.id ? { ...emp, ...userData } : emp
            )
          );
        }
      }
      handleCloseModal();
      await loadInitialData();
    } catch (error) {
      alert("Erro ao salvar. Verifique o console.");
    }
  };

  const handleDelete = async () => {
    try {
      if (activeTab === "cardapio") {
        await fetch(`${API_URL}/dishes/${selectedItem.id}`, {
          method: "DELETE",
        });
        setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id));
      } else {
        if (selectedItem.type.toLowerCase() === "administrador") {
          alert("Não é possível excluir o usuário administrador!");
          handleCloseModal();
          return;
        }
        await fetch(`${API_URL}/users/${selectedItem.id}`, {
          method: "DELETE",
        });
        setEmployees(employees.filter((emp) => emp.id !== selectedItem.id));
      }
      handleCloseModal();
    } catch (error) {
      alert("Erro ao excluir. Verifique o console.");
    }
  };

  const handleOpenDescription = (item) => {
    setSelectedItem(item);
    setModalType("description");
    setShowModal(true);
  };

  const filteredMenuItems = menuItems
    .filter((item) => item.categoryId === selectedCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Carregando...</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboard}>
          <div className={styles.titleDiv}>
            <h1
              className={`${styles.title} ${activeTab === "cardapio" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("cardapio")}
            >
              Cardápio
            </h1>
            <h1
              className={`${styles.title} ${activeTab === "funcionarios" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("funcionarios")}
            >
              Funcionários
            </h1>
          </div>

          {activeTab === "cardapio" && (
            <>
              <div className={styles.categoriesContainer}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`${styles.categoryIcon} ${selectedCategory === category.id
                        ? styles.activeCategoryIcon
                        : ""
                      }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                ))}
              </div>

              <div className={styles.tableHeader}>
                <p className={styles.headerItem}>Nome</p>
                <p className={styles.headerItem}>Descrição</p>
                <p className={styles.headerItem}>Preço</p>
                <p className={styles.headerItem}>Ações</p>
              </div>

              <div className={styles.tableBody}>
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <p className={styles.itemText}>{item.name}</p>
                    <button
                      className={styles.descriptionButton}
                      onClick={() => handleOpenDescription(item)}
                    >
                      Ver descrição
                    </button>
                    <p className={styles.itemText}>
                      R$ {item.price.toFixed(2)}
                    </p>
                    <div className={styles.actionsCell}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleOpenModal("edit", item)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleOpenModal("delete", item)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "funcionarios" && (
            <>
              <div className={styles.tableHeader}>
                <p className={styles.headerItem}>Nome</p>
                <p className={styles.headerItem}>Cargo</p>
                <p className={styles.headerItem}>Código</p>
                <p className={styles.headerItem}>Ações</p>
              </div>

              <div className={styles.tableBody}>
                {employees.map((employee) => (
                  <div key={employee.id} className={styles.tableRow}>
                    <p className={styles.itemText}>{employee.name}</p>
                    <p className={styles.itemText}>{employee.type}</p>
                    <div className={styles.codeCell}>
                      <p className={styles.itemText}>
                        {visibleCodes[employee.id] || "••••••"}
                      </p>
                      <button
                        className={styles.resetCodeButton}
                        onClick={() => handleResetCode(employee)}
                        title="Resetar código de acesso"
                      >
                        👁
                      </button>
                    </div>
                    <div className={styles.actionsCell}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleOpenModal("edit", employee)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleOpenModal("delete", employee)}
                        disabled={
                          employee.type.toLowerCase() === "administrador"
                        }
                        style={{
                          opacity:
                            employee.type.toLowerCase() === "administrador"
                              ? 0.5
                              : 1,
                          cursor:
                            employee.type.toLowerCase() === "administrador"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          className={styles.button}
          onClick={() => handleOpenModal("add")}
        >
          <p className={styles.buttonText}>Adicionar</p>
          <span className={styles.emoji}>+</span>
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ×
            </button>

            {modalType === "description" && (
              <div className={styles.descriptionModal}>
                <h2 className={styles.modalTitle}>Descrição</h2>
                <div className={styles.descriptionContent}>
                  <p className={styles.descriptionText}>
                    {selectedItem?.description}
                  </p>
                </div>
                <div className={styles.descriptionActions}>
                  <button
                    className={styles.closeDescriptionButton}
                    onClick={handleCloseModal}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {modalType === "delete" && (
              <div className={styles.deleteModal}>
                <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
                <p className={styles.deleteMessage}>
                  Tem certeza que deseja excluir{" "}
                  <strong>{selectedItem?.name}</strong>?
                </p>
                <div className={styles.deleteActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.confirmDeleteButton}
                    onClick={handleDelete}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}

            {modalType === "confirmReset" && (
              <div className={styles.resetModal}>
                <h2 className={styles.modalTitle}>
                  ⚠️ Resetar Código de Acesso
                </h2>
                <p className={styles.resetMessage}>
                  Você está prestes a resetar o código de acesso de{" "}
                  <strong>{selectedItem?.name}</strong>.
                </p>
                <p className={styles.resetWarning}>
                  ⚠️ O código antigo será invalidado e o funcionário não poderá
                  mais usá-lo para acessar o sistema.
                </p>
                <p className={styles.resetInfo}>
                  Um novo código será gerado e você deverá informá-lo ao
                  funcionário.
                </p>
                <div className={styles.resetActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.confirmResetButton}
                    onClick={confirmResetCode}
                  >
                    Confirmar Reset
                  </button>
                </div>
              </div>
            )}

            {modalType === "showNewCode" && (
              <div className={styles.newCodeModal}>
                <h2 className={styles.modalTitle}>
                  ✅ Código Resetado com Sucesso!
                </h2>
                <p className={styles.newCodeMessage}>
                  Novo código de acesso para{" "}
                  <strong>{selectedItem?.name}</strong>:
                </p>
                <div className={styles.codeDisplay}>
                  <span className={styles.newCode}>{newResetCode}</span>
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(newResetCode)}
                    title="Copiar código"
                  >
                    📋 Copiar
                  </button>
                </div>
                <p className={styles.codeWarning}>
                  ⚠️ <strong>IMPORTANTE:</strong> Anote ou copie este código
                  agora! Você precisará informá-lo ao funcionário.
                </p>
                <p className={styles.codeInfo}>
                  O código antigo não funcionará mais.
                </p>
                <div className={styles.newCodeActions}>
                  <button
                    className={styles.closeNewCodeButton}
                    onClick={handleCloseModal}
                  >
                    Entendi, Fechar
                  </button>
                </div>
              </div>
            )}

            {(modalType === "add" || modalType === "edit") && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.modalTitle}>
                  {modalType === "add" ? "Adicionar" : "Editar"}{" "}
                  {activeTab === "cardapio" ? "Item" : "Funcionário"}
                </h2>

                {activeTab === "cardapio" ? (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nome do Item</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Categoria</label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Descrição</label>
                      <textarea
                        name="description"
                        value={formData.description}
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
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={styles.input}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nome</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Cargo</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      >
                        <option value="">Selecione um cargo</option>
                        <option value="administrador">Administrador</option>
                        <option value="caixa">Caixa</option>
                        <option value="garcom">Garçom</option>
                        <option value="cozinha">Cozinha</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Código de Acesso</label>
                      <input
                        type="text"
                        name="accessCode"
                        value={formData.accessCode}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="#12345"
                        required
                      />
                    </div>
                  </>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {modalType === "add" ? "Adicionar" : "Salvar"}
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
