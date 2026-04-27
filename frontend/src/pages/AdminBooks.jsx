import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const { data } = await bookService.getAll();
    setBooks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.update(editingBook.id, formData);
      } else {
        await bookService.create(formData);
      }
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', description: '', price: 0, imageUrl: '', stock: 0 });
      loadBooks();
    } catch (err) {
      alert('Hata oluştu');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      await bookService.delete(id);
      loadBooks();
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Kitap Yönetimi</h2>
        <button onClick={() => { setEditingBook(null); setFormData({ title: '', author: '', description: '', price: 0, imageUrl: '', stock: 0 }); setIsModalOpen(true); }} className="btn btn-primary">
          <Plus size={20} /> Yeni Kitap Ekle
        </button>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Kitap</th>
              <th style={{ padding: '1rem' }}>Yazar</th>
              <th style={{ padding: '1rem' }}>Fiyat</th>
              <th style={{ padding: '1rem' }}>Stok</th>
              <th style={{ padding: '1rem' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={book.imageUrl} alt="" style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                  {book.title}
                </td>
                <td style={{ padding: '1rem' }}>{book.author}</td>
                <td style={{ padding: '1rem' }}>{book.price} ₺</td>
                <td style={{ padding: '1rem' }}>{book.stock}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(book)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(book.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '2rem', background: 'var(--dark-lighter)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>{editingBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Kitap Adı</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Yazar</label>
                  <input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Açıklama</label>
                <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Fiyat (₺)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label>Stok Adedi</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="input-group">
                <label>Görsel URL</label>
                <input type="url" required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  <Check size={20} /> {editingBook ? 'Güncelle' : 'Ekle'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
