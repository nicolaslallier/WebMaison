import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/file-management', label: 'File Management', icon: '📁' },
  ];

  return (
    <nav className="menu">
      <div className="menu-container">
        <div className="menu-logo">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">WebMaison</span>
        </div>
        <ul className="menu-items">
          {menuItems.map((item) => (
            <li key={item.path} className="menu-item">
              <Link
                to={item.path}
                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Menu; 