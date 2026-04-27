import React from 'react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { Trash2, CreditCard, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const items = cart.map(item => ({ bookId: item.id, quantity: item.quantity }));
      await orderService.create(items);
      alert('Siparişiniz başarıyla alındı!');
      clearCart();
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Sipariş sırasında bir hata oluştu');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <ShoppingBag size={64} style={{ color: 'var(--gray)', marginBottom: '1.5rem' }} />
        <h2>Sepetiniz boş.</h2>
        <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Hemen alışverişe başlayın!</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Kitaplara Göz At
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Sepetiniz</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map((item) => (
            <div key={item.id} className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray)' }}>{item.author}</p>
                <p style={{ marginTop: '0.5rem' }}>Adet: {item.quantity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>{item.price * item.quantity} ₺</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', marginTop: '1rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Sipariş Özeti</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Ara Toplam</span>
            <span>{total} ₺</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Kargo</span>
            <span style={{ color: 'var(--success)' }}>Bedava</span>
          </div>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800' }}>
            <span>Toplam</span>
            <span style={{ color: 'var(--secondary)' }}>{total} ₺</span>
          </div>
          <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <CreditCard size={20} /> Satın Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
