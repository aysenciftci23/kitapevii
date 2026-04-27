import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="container nav-content">
        <Link to="/" className="logo">KİTAPEVİ</Link>
        <div className="nav-links">
          <Link to="/">Kitaplar</Link>
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="btn btn-outline">
                  <LayoutDashboard size={18} /> Panel
                </Link>
              )}
              <Link to="/cart" className="btn btn-outline" style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--secondary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray)' }}>
                <UserIcon size={18} /> {user.name}
              </div>
              <button onClick={handleLogout} className="btn btn-primary">
                <LogOut size={18} /> Çıkış
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Giriş Yap</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
