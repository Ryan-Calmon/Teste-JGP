import { useGestor } from '../context/GestorContext';
import "../styles/Header.css";

export default function Header() {
  const { gestor, limparGestor } = useGestor();

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="https://jgp.com.br/wp-content/uploads/2023/06/JGP-white-1.svg" 
          alt="JGP" 
          className="header-logo"
        />
        <span className="header-subtitle">Gestão das Emissões</span>
      </div>
      
      <div className="header-right">
        {gestor && (
          <div className="user-info">
            <span className="user-avatar">
              {gestor.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">{gestor}</span>
            <button 
              className="btn btn-text"
              onClick={limparGestor}
              title="Trocar usuário"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
