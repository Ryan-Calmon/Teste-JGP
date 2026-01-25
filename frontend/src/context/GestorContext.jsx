import { createContext, useContext, useState, useEffect } from 'react';

const GestorContext = createContext();

export function GestorProvider({ children }) {
  const [gestor, setGestor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const gestorSalvo = localStorage.getItem('gestor_nome');
    if (gestorSalvo) {
      setGestor(gestorSalvo);
    } else {
      setShowModal(true); 
    }
  }, []);

  const salvarGestor = (nome) => {
    localStorage.setItem('gestor_nome', nome);
    setGestor(nome);
    setShowModal(false);
  };

  const limparGestor = () => {
    localStorage.removeItem('gestor_nome');
    setGestor(null);
    setShowModal(true);
  };

  return (
    <GestorContext.Provider value={{ 
      gestor, 
      salvarGestor, 
      limparGestor,
      showModal,
      setShowModal 
    }}>
      {children}
    </GestorContext.Provider>
  );
}

export function useGestor() {
  const context = useContext(GestorContext);
  if (!context) {
    throw new Error('useGestor deve ser usado dentro de GestorProvider');
  }
  return context;
}
