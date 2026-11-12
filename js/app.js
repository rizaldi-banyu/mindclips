/* =========================================
   MINDCLIPS — APPLICATION SCRIPT
   Data produk diambil dari data/products.json
========================================= */

const PRODUCTS_URL = (window.location.pathname.includes("/pages/"))
  ? "../data/products.json"
  : "data/products.json";

let allProducts = [];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function productImage(product) {
  const fallback = (window.location.pathname.includes("/pages/"))
    ? "../assets/images/placeholder.svg"
    : "assets/images/placeholder.svg";
  const imagePath = product.image || fallback;
  return imagePath;
}

function productCard(product) {
  const isPages = window.location.pathname.includes("/pages/");
  const detailPath = isPages ? "product.html" : "pages/product.html";
  const imagePath = productImage(product);
  return `
    <article class="product-card">
      <a class="product-card-link" href="${detailPath}?id=${encodeURIComponent(product.id)}">
        <div class="product-image">
          <img src="${imagePath}" alt="${product.name}" loading="lazy"
               onerror="this.onerror=null;this.src='${isPages ? "../assets/images/placeholder.svg" : "assets/images/placeholder.svg"}'">
        </div>
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-price">${formatRupiah(product.price)}</p>
      </a>
    </article>
  `;
}

async function loadProducts() {
  try {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) throw new Error(`Gagal memuat data: ${response.status}`);
    allProducts = await response.json();
    renderFeatured();
    renderCatalog();
    renderProductDetail();
    populateCategories();
  } catch (error) {
    console.error(error);
    document.querySelectorAll("#featured-products, #catalog-products, #product-detail")
      .forEach((element) => {
        if (element) element.innerHTML = '<p class="empty-state">Produk belum dapat dimuat. Jalankan website melalui Live Server dan periksa data/products.json.</p>';
      });
  }
}

function renderFeatured() {
  const target = document.getElementById("featured-products");
  if (!target) return;
  const featured = allProducts.filter((product) => product.featured).slice(0, 3);
  target.innerHTML = featured.length
    ? featured.map(productCard).join("")
    : '<p class="empty-state">Belum ada produk unggulan.</p>';
}

function populateCategories() {
  const select = document.getElementById("category-filter");
  if (!select) return;
  const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort();
  select.innerHTML = '<option value="">Semua kategori</option>' +
    categories.map((category) => `<option value="${category}">${category}</option>`).join("");
}

function renderCatalog() {
  const target = document.getElementById("catalog-products");
  if (!target) return;
  const search = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const category = document.getElementById("category-filter")?.value || "";
  const sort = document.getElementById("sort-select")?.value || "default";

  let filtered = allProducts.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search);
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name, "id"));
  if (sort === "price-asc") filtered.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-desc") filtered.sort((a, b) => Number(b.price) - Number(a.price));

  target.innerHTML = filtered.map(productCard).join("");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");
  if (count) count.textContent = `${filtered.length} produk ditemukan`;
  if (empty) empty.hidden = filtered.length > 0;
}

function renderProductDetail() {
  const target = document.getElementById("product-detail");
  if (!target) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const product = allProducts.find((item) => String(item.id) === String(id));
  if (!product) {
    target.innerHTML = '<p class="empty-state">Produk tidak ditemukan. Silakan kembali ke katalog.</p>';
    return;
  }
  const isPages = window.location.pathname.includes("/pages/");
  const fallback = isPages ? "../assets/images/placeholder.svg" : "assets/images/placeholder.svg";
  const image = product.image || fallback;
  target.innerHTML = `
    <div class="product-detail-image">
      <img src="${image}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallback}'">
    </div>
    <div class="product-detail-copy">
      <p class="eyebrow">${product.category || "PRODUK PILIHAN"}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${formatRupiah(product.price)}</p>
      <p>${product.description || "Produk pilihan MindClips untuk kebutuhan sehari-hari."}</p>
      <div class="detail-meta">
        ${product.rating ? `<span>★ ${product.rating}</span>` : ""}
        ${product.sold ? `<span>Terjual ${product.sold}</span>` : ""}
      </div>
      <a class="button button-dark" href="${product.affiliate_link || "#"}" target="_blank" rel="noopener noreferrer">Lihat di Shopee <span>↗</span></a>
      <p class="affiliate-note">Tautan ini merupakan tautan afiliasi.</p>
    </div>
  `;
}

function setupUI() {
  document.getElementById("search-input")?.addEventListener("input", renderCatalog);
  document.getElementById("category-filter")?.addEventListener("change", renderCatalog);
  document.getElementById("sort-select")?.addEventListener("change", renderCatalog);

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  toggle?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupUI();
  loadProducts();
});
