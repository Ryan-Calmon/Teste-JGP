import { useState } from 'react';
import "../styles/Sidebar.css"
import { GoDatabase } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";

export default function Sidebar({ paginaAtual, setPaginaAtual }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <VscGraph /> },
    { id: 'emissoes', label: 'Emissões', icon: <GoDatabase /> },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-item ${paginaAtual === item.id ? 'active' : ''}`}
                onClick={() => setPaginaAtual(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
