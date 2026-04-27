import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search } from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const { data } = await bookService.getAll();
      setBooks(data);
    } catch (err) {
      console.error('Kitaplar yüklenemedi', err);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <header style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>En İyi Kitapları Keşfedin</h1>
        <p style={{ color: 'var(--gray)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Dünya klasiklerinden en yeni çıkanlara kadar binlerce kitap sizi bekliyor.
        </p>
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} size={20} />
          <input 
            type="text" 
            placeholder="Kitap veya yazar ara..." 
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="glass book-card">
            <div className="book-image">
              <img src={book.imageUrl} alt={book.title} />
              {book.stock <= 0 && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px', 
                  background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem',
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2
                }}>
                  Tükendi
                </div>
              )}
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="book-price">{book.price} ₺</span>
                <button 
                  onClick={() => addToCart(book)}
                  className="btn btn-primary"
                  disabled={book.stock <= 0}
                  style={{ 
                    padding: '0.5rem',
                    background: book.stock <= 0 ? '#94a3b8' : 'var(--primary)',
                    cursor: book.stock <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {book.stock <= 0 ? 'Tükendi' : <ShoppingCart size={20} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
