# MindClips — Website Starter

Website katalog affiliate sederhana menggunakan HTML, CSS, JavaScript, dan JSON.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka folder `mindclips-final` di Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi **Live Server**.
   - Jangan membuka file langsung dengan `file://`, karena katalog membaca `data/products.json` menggunakan `fetch()`.

## Struktur folder
- `index.html` — halaman beranda
- `pages/explore.html` — katalog, pencarian, filter, dan pengurutan
- `pages/product.html` — halaman detail produk
- `pages/about.html` — halaman tentang MindClips
- `css/style.css` — seluruh desain website
- `js/app.js` — logika tampilan dan pemuatan data
- `data/products.json` — daftar produk yang bisa diedit
- `assets/images/` — tempat foto produk

## Cara mengganti foto produk
1. Simpan foto produk di `assets/images/`, contoh: `rak-piring.jpg`.
2. Buka `data/products.json`.
3. Ubah nilai `image` untuk produk terkait menjadi:
   `"image": "assets/images/rak-piring.jpg"`
4. Untuk path foto pada JSON, gunakan path relatif dari folder utama proyek seperti contoh di atas. Script akan menyesuaikan path halaman detail/katalog secara otomatis.

## Cara menambah produk
Tambahkan objek baru ke dalam array `data/products.json` dengan format:

{
  "id": "nama-produk",
  "name": "Nama Produk",
  "category": "Kategori",
  "price": 50000,
  "rating": "4.8",
  "sold": "1rb+",
  "image": "assets/images/nama-produk.jpg",
  "affiliate_link": "https://...",
  "description": "Deskripsi singkat produk.",
  "featured": false
}

Pastikan setiap `id` unik. Gunakan angka untuk `price` tanpa titik atau simbol rupiah. Set `featured` menjadi `true` jika ingin produk tampil di beranda.

## Mengatur ukuran gambar
Buka `css/style.css`, cari bagian `6. PRODUCT IMAGE`.
- Ubah `height: 220px` untuk mengatur tinggi kotak gambar.
- Ubah `width: 80%` dan `height: 80%` pada `.product-card .product-image img` untuk mengatur besar foto di dalam kotak.
- Jangan menambahkan aturan baru di dalam blok CSS lain. Pastikan setiap selector ditulis setelah `}` penutup selector sebelumnya.

## Catatan
- Harga produk yang belum diketahui diisi `0`; ubah sebelum website dipublikasikan.
- Foto yang disertakan adalah placeholder. Ganti dengan foto produk milikmu.
- Tautan afiliasi pada data awal berasal dari daftar produk MindClips sebelumnya. Periksa kembali tautannya sebelum publikasi.
- Ini adalah versi frontend statis. Belum ada database, dashboard admin, atau pencatatan klik.
