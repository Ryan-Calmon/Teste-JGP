import { useState } from 'react';
import { GestorProvider, useGestor } from './context/GestorContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GestorModal from './components/GestorModal';
import Dashboard from './pages/Dashboard';
import Emissoes from './pages/Emissoes';
import './App.css';

function AppContent() {
  const { gestor } = useGestor();
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  
  const [menuAberto, setMenuAberto] = useState(false);

  const renderPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard />;
      case 'emissoes':
        return <Emissoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <GestorModal />
      
      {gestor && (
        <>
          <Header onToggleMenu={() => setMenuAberto(!menuAberto)} />
          
          <div className="app-container">
            <Sidebar 
              paginaAtual={paginaAtual} 
              setPaginaAtual={setPaginaAtual}
              isOpen={menuAberto}
              closeMenu={() => setMenuAberto(false)}
            />
            
            <main className="main-content">
              {renderPagina()}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <GestorProvider>
      <AppContent />
    </GestorProvider>
  );
}

export default App;