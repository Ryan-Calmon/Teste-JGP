import { useState } from 'react';
import { useGestor } from '../context/GestorContext';
import "../styles/GestorModal.css"

export default function GestorModal() {
  const { showModal, salvarGestor } = useGestor();
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (nome.trim().length < 3) {
      setErro('Nome deve ter pelo menos 3 caracteres');
      return;
    }
    
    salvarGestor(nome.trim());
    setErro('');
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal gestor-modal">
        <img 
          src="https://jgp.com.br/wp-content/uploads/2023/06/JGP-white-1.svg" 
          alt="JGP" 
          className="header-logo-gestormodal"
        />
        <h2>Painel Administrativo</h2>
        <p>Identifique-se para registrar suas alterações:</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Seu nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ryan Calmon"
              autoFocus
            />
            {erro && <span className="error-message">{erro}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
