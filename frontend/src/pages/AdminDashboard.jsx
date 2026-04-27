import React, { useState, useEffect } from 'react';
import { adminService, bookService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    coverImage: '',
    stock: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await adminService.getStats();
      const booksRes = await bookService.getAll();
      setStats(statsRes.data);
      setBooks(booksRes.data);
    } catch (err) {
      console.error('Veriler yüklenemedi', err);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tüm verileri silip varsayılan (seed) verilere dönmek istediğinize emin misiniz?')) {
      setLoading(true);
      try {
        await adminService.resetDb();
        alert('Veritabanı başarıyla sıfırlandı!');
        window.location.reload();
      } catch (err) {
        alert('Hata: ' + err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sadece backend'in beklediği alanları gönderiyoruz
      const { coverImage, ...rest } = formData;
      const payload = { 
        ...rest, 
        imageUrl: coverImage,
        description: formData.title // Açıklama olarak şimdilik başlığı gönderiyoruz
      };

      if (editingBook) {
        await bookService.update(editingBook.id, payload);
      } else {
        await bookService.create(payload);
      }
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', price: 0, coverImage: '', stock: 0 });
      loadData();
    } catch (err) {
      alert('İşlem sırasında bir hata oluştu');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.imageUrl,
      stock: book.stock
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      await bookService.delete(id);
      loadData();
    }
  };

  // State 2 chart data - Gerçekçi random veriler (Base) + Gerçek sipariş verileri
  const baseData = [
    { month: 'Jan', total: 450 },
    { month: 'Feb', total: 380 },
    { month: 'Mar', total: 520 },
    { month: 'Apr', total: 610 },
    { month: 'May', total: 580 },
    { month: 'Jun', total: 720 },
    { month: 'Jul', total: 690 },
    { month: 'Aug', total: 850 },
    { month: 'Sep', total: 780 },
    { month: 'Oct', total: 920 },
    { month: 'Nov', total: 1250 }, // Black Friday peak
    { month: 'Dec', total: 1100 }
  ];

  const chartData = baseData.map(item => {
    const realStat = stats.find(s => s.month === item.month);
    return {
      month: item.month,
      total: item.total + (realStat ? realStat.total : 0)
    };
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000' }}>Inventory Dashboard</h1>
          <button 
            onClick={() => { setEditingBook(null); setFormData({ title: '', author: '', price: 0, coverImage: '', stock: 0 }); setIsModalOpen(true); }}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Yeni Kitap Ekle
          </button>
        </div>

        {/* Book List Table */}
        <div className="dashboard-card">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Book List</th>
                <th>Authors</th>
                <th>Price</th>
                <th>Cover Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="book-title-cell">{book.title}</div>
                    <div className="book-subtitle-cell">{book.title} Edition</div>
                  </td>
                  <td>{book.author}</td>
                  <td style={{ fontWeight: '500' }}>
                    ₺{book.price.toFixed(2)}
                    {book.stock <= 0 && (
                      <span style={{ color: '#ef4444', fontSize: '0.7rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                        (TÜKENDİ)
                      </span>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: '400' }}>Stok: {book.stock}</div>
                  </td>
                  <td>
                    <img src={book.imageUrl} alt="" className="cover-img" />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(book)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(book.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="dashboard-card" style={{ height: '400px', marginBottom: '4rem' }}>
          <h3>Monthly Revenue</h3>
          <div style={{ padding: '1.5rem', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#999" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
                <Tooltip 
                  contentStyle={{ background: 'white', border: '1px solid #eee', borderRadius: '4px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  dot={{ r: 3, fill: 'white', stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <ReferenceLine x="Nov" stroke="#ef4444" label={{ position: 'top', value: 'Black Friday', fill: '#ef4444', fontSize: 10 }} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="dashboard-footer">
        <div style={{ fontWeight: '600', color: '#666' }}>Bookstore Dashboard</div>
        <button 
          onClick={handleReset} 
          disabled={loading}
          className="btn" 
          style={{ background: 'white', border: '1px solid #ccc', color: '#333', padding: '0.4rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Sıfırlanıyor...' : 'Admin Reset'}
        </button>
      </footer>

      {/* Modal for CRUD */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ border: 'none', padding: 0 }}>{editingBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label style={{ color: '#333' }}>Kitap Adı</label>
                <input required style={{ background: '#fff', color: '#000', border: '1px solid #ddd' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{ color: '#333' }}>Yazar</label>
                <input required style={{ background: '#fff', color: '#000', border: '1px solid #ddd' }} value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label style={{ color: '#333' }}>Fiyat (₺)</label>
                  <input type="number" step="0.01" required style={{ background: '#fff', color: '#000', border: '1px solid #ddd' }} value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="input-group">
                  <label style={{ color: '#333' }}>Stok</label>
                  <input type="number" required style={{ background: '#fff', color: '#000', border: '1px solid #ddd' }} value={formData.stock || ''} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="input-group">
                <label style={{ color: '#333' }}>Kapak Görseli URL</label>
                <input type="url" required style={{ background: '#fff', color: '#000', border: '1px solid #ddd' }} value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {editingBook ? 'Güncelle' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
