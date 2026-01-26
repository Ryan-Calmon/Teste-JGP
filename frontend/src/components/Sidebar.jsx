import "../styles/Sidebar.css"
import { GoDatabase } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";
import { MdClose } from "react-icons/md"; 

export default function Sidebar({ paginaAtual, setPaginaAtual, isOpen, closeMenu }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <VscGraph /> },
    { id: 'emissoes', label: 'Emissões', icon: <GoDatabase /> },
  ];

  const handleItemClick = (id) => {
    setPaginaAtual(id);
    if (window.innerWidth <= 768) {
      closeMenu();
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">Menu</span>
          <button className="close-btn" onClick={closeMenu}>
            <MdClose />
          </button>
        </div>

        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${paginaAtual === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}