import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ 
          background: 'var(--primary)', 
          padding: '0.5rem', 
          borderRadius: '12px', 
          color: 'white',
          marginBottom: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
        }}>
          <BookOpen size={28} />
        </div>
        <span style={{ 
          fontSize: '1.1rem', 
          letterSpacing: '1px', 
          textTransform: 'uppercase',
          color: '#1e293b'
        }}>
          Kitapevi
        </span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
