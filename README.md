# 📚 Online Kitabevi Satış Sitesi (Premium Demo)

Bu proje, modern bir e-ticaret deneyimi sunan, tam kapsamlı (Full-stack) bir kitap satış platformudur. "Golden State" tasarım prensiplerine uygun olarak geliştirilmiştir.

## ✨ Öne Çıkan Özellikler

- **🎭 State 2 Dashboard:** Görsel olarak zenginleştirilmiş, profesyonel "Inventory Dashboard" arayüzü.
- **📊 Akıllı Grafikler:** Recharts ile oluşturulan, hem demo verilerini hem de gerçek satışları anlık gösteren "Monthly Revenue" alanı.
- **🏷️ Stok Takibi:** Stoğu biten ürünler için otomatik "Tükendi" rozeti ve satın alma engelleme sistemi.
- **🛠️ Tam CRUD Yönetimi:** Admin panelinden kitap ekleme, silme, güncelleme ve anlık stok yönetimi.
- **🔐 Güvenli Yetkilendirme:** JWT tabanlı, Admin ve Kullanıcı rollerine ayrılmış giriş sistemi.
- **🔄 Tek Tıkla Reset:** Veritabanını her zaman orijinal "Altın Durum"una (seed.json) döndüren mekanizma.

## 🚀 Teknolojiler

- **Backend:** NestJS, TypeORM, PostgreSQL, JWT, Bcrypt
- **Frontend:** React (Vite), Lucide Icons, Recharts, Vanilla CSS (Premium Glassmorphism & Light Theme)

## 🛠️ Kurulum

### 1. Veritabanı
PostgreSQL üzerinde `online_kitapevi` adında bir veritabanı oluşturun.

### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Giriş Bilgileri

- **Admin:** `admin@kitapevi.com` / `adminpassword`
- **Kullanıcı:** `user@test.com` / `userpassword`

## 📂 Proje Yapısı
- `/backend`: NestJS API servisi ve veritabanı modelleri.
- `/frontend`: Vite+React tabanlı modern arayüz.
- `seed.json`: Sistemin başlangıç kitap verilerini içeren dosya.

---
*Bu proje modern web standartları ve "Sales-Ready Demo" kalitesiyle hazırlanmıştır.*
