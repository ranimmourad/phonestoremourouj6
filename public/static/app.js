/* ═══════════════════════════════════════════════════════
   Phone Store Mourouj 6 - Complete Frontend Application
   ═══════════════════════════════════════════════════════ */

// ─── STATE MANAGEMENT ───
const Store = {
  cart: JSON.parse(localStorage.getItem('ps_cart') || '[]'),
  products: [],
  categories: [],
  adminToken: localStorage.getItem('ps_admin_token') || '',
  currentPage: 'home',
  currentCategory: '',
  searchQuery: '',

  saveCart() {
    localStorage.setItem('ps_cart', JSON.stringify(this.cart));
    this.renderCartBadge();
  },

  addToCart(product, qty = 1) {
    const existing = this.cart.find(i => i.product_id === product.id);
    if (existing) { existing.quantity += qty; }
    else {
      this.cart.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: qty
      });
    }
    this.saveCart();
    showToast('Produit ajouté au panier', 'success');
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.product_id !== productId);
    this.saveCart();
  },

  updateQty(productId, qty) {
    const item = this.cart.find(i => i.product_id === productId);
    if (item) { item.quantity = Math.max(1, qty); }
    this.saveCart();
  },

  getCartTotal() {
    return this.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getCartCount() {
    return this.cart.reduce((sum, i) => sum + i.quantity, 0);
  },

  renderCartBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const count = this.getCartCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ─── API HELPERS ───
const API = {
  async get(url) {
    const headers = {};
    if (Store.adminToken) headers['Authorization'] = `Bearer ${Store.adminToken}`;
    const res = await fetch(url, { headers });
    return res.json();
  },
  async post(url, data) {
    const headers = { 'Content-Type': 'application/json' };
    if (Store.adminToken) headers['Authorization'] = `Bearer ${Store.adminToken}`;
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
    return res.json();
  },
  async put(url, data) {
    const headers = { 'Content-Type': 'application/json' };
    if (Store.adminToken) headers['Authorization'] = `Bearer ${Store.adminToken}`;
    const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(data) });
    return res.json();
  },
  async del(url) {
    const headers = {};
    if (Store.adminToken) headers['Authorization'] = `Bearer ${Store.adminToken}`;
    const res = await fetch(url, { method: 'DELETE', headers });
    return res.json();
  }
};

// ─── TOAST ───
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle text-green-400' : 'fa-exclamation-circle text-red-400'}"></i><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ─── PRODUCT IMAGE GENERATOR (SVG placeholders) ───
function getProductSVG(name, categorySlug) {
  const colors = {
    chargers: ['#3b82f6', '#60a5fa'], cables: ['#8b5cf6', '#a78bfa'],
    adapters: ['#06b6d4', '#22d3ee'], cases: ['#f59e0b', '#fbbf24'],
    'screen-protection': ['#10b981', '#34d399'], headphones: ['#ec4899', '#f472b6'],
    earpods: ['#6366f1', '#818cf8'], smartwatches: ['#14b8a6', '#2dd4bf'],
    'ring-lights': ['#f97316', '#fb923c'], gaming: ['#ef4444', '#f87171'],
    'computer-accessories': ['#8b5cf6', '#a78bfa']
  };
  const [c1, c2] = colors[categorySlug] || ['#3b82f6', '#60a5fa'];
  const icons = {
    chargers: '<path d="M35 25h30v50H35z" rx="4" fill="none" stroke="'+c2+'" stroke-width="2"/><path d="M45 20v5M55 20v5" stroke="'+c2+'" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="'+c1+'" opacity="0.6"/><path d="M50 44v12M44 50h12" stroke="#fff" stroke-width="2"/>',
    cables: '<path d="M30 30C30 30 40 50 50 50S70 70 70 70" stroke="'+c2+'" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="6" fill="'+c1+'"/><circle cx="70" cy="70" r="6" fill="'+c1+'"/>',
    adapters: '<rect x="30" y="30" width="40" height="40" rx="8" fill="none" stroke="'+c2+'" stroke-width="2"/><circle cx="42" cy="50" r="4" fill="'+c1+'"/><circle cx="58" cy="50" r="4" fill="'+c1+'"/>',
    cases: '<rect x="32" y="18" width="36" height="64" rx="8" fill="none" stroke="'+c2+'" stroke-width="2"/><rect x="37" y="24" width="26" height="46" rx="4" fill="'+c1+'" opacity="0.2"/><circle cx="50" cy="78" r="2" fill="'+c2+'"/>',
    'screen-protection': '<rect x="32" y="18" width="36" height="64" rx="8" fill="none" stroke="'+c2+'" stroke-width="2"/><rect x="36" y="24" width="28" height="44" rx="2" fill="'+c1+'" opacity="0.15"/><path d="M44 46l4 4 8-8" stroke="'+c1+'" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    headphones: '<path d="M30 50A20 20 0 0 1 70 50" stroke="'+c2+'" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="24" y="48" width="12" height="20" rx="6" fill="'+c1+'"/><rect x="64" y="48" width="12" height="20" rx="6" fill="'+c1+'"/>',
    earpods: '<ellipse cx="40" cy="50" rx="10" ry="14" fill="'+c1+'" opacity="0.7"/><ellipse cx="60" cy="50" rx="10" ry="14" fill="'+c1+'" opacity="0.7"/><path d="M40 36v-8M60 36v-8" stroke="'+c2+'" stroke-width="2"/>',
    smartwatches: '<rect x="32" y="22" width="36" height="56" rx="12" fill="none" stroke="'+c2+'" stroke-width="2"/><rect x="38" y="30" width="24" height="24" rx="4" fill="'+c1+'" opacity="0.2"/><path d="M50 18v-8M50 82v8" stroke="'+c2+'" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="42" r="8" fill="none" stroke="'+c1+'" stroke-width="1.5"/><path d="M50 38v4l3 3" stroke="'+c1+'" stroke-width="1.5" stroke-linecap="round"/>',
    'ring-lights': '<circle cx="50" cy="50" r="22" fill="none" stroke="'+c2+'" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="none" stroke="'+c1+'" stroke-width="1.5" opacity="0.5"/><path d="M50 72v16" stroke="'+c2+'" stroke-width="2"/><path d="M42 88h16" stroke="'+c2+'" stroke-width="2" stroke-linecap="round"/>',
    gaming: '<rect x="25" y="35" width="50" height="30" rx="15" fill="none" stroke="'+c2+'" stroke-width="2"/><circle cx="38" cy="50" r="6" fill="'+c1+'" opacity="0.4"/><circle cx="58" cy="46" r="3" fill="'+c1+'"/><circle cx="64" cy="50" r="3" fill="'+c1+'"/><circle cx="58" cy="54" r="3" fill="'+c1+'"/><circle cx="52" cy="50" r="3" fill="'+c1+'"/>',
    'computer-accessories': '<rect x="25" y="30" width="50" height="32" rx="3" fill="none" stroke="'+c2+'" stroke-width="2"/><rect x="29" y="34" width="42" height="24" rx="1" fill="'+c1+'" opacity="0.15"/><path d="M40 62v6M60 62v6M35 68h30" stroke="'+c2+'" stroke-width="2" stroke-linecap="round"/>'
  };
  const icon = icons[categorySlug] || icons.chargers;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="bg"><stop offset="0%" stop-color="${c1}" stop-opacity="0.08"/><stop offset="100%" stop-color="#020617" stop-opacity="0"/></radialGradient></defs><rect width="100" height="100" fill="url(#bg)"/>${icon}</svg>`)}`;
}

// ─── ROUTER ───
function navigate(page, pushState = true) {
  Store.currentPage = page;
  if (pushState) {
    const url = page === 'home' ? '/' : `/${page}`;
    history.pushState({ page }, '', url);
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
  const page = e.state?.page || getPageFromPath();
  Store.currentPage = page;
  renderApp();
});

function getPageFromPath() {
  const path = location.pathname;
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/admin')) return 'admin';
  return path.replace('/', '');
}

// ─── MAIN RENDER ───
function renderApp() {
  const app = document.getElementById('app');
  const page = Store.currentPage;

  if (page === 'admin') {
    app.innerHTML = Store.adminToken ? renderAdminDashboard() : renderAdminLogin();
  } else if (page === 'cart') {
    app.innerHTML = renderNavbar() + renderCartPage() + renderFooter();
  } else if (page === 'checkout') {
    app.innerHTML = renderNavbar() + renderCheckoutPage() + renderFooter();
  } else if (page === 'products') {
    app.innerHTML = renderNavbar() + renderProductsPage() + renderFooter();
  } else {
    app.innerHTML = renderNavbar() + renderHomePage() + renderFooter();
  }

  // Post-render
  initScrollAnimations();
  initSwipers();
  initFAQ();
  initNavbar();
  initMobileMenu();
  Store.renderCartBadge();
  if (page === 'admin' && Store.adminToken) initAdminPolling();
  animateCounters();
}

// ─── NAVBAR ───
function renderNavbar() {
  return `
  <nav class="navbar py-4 px-6" id="navbar">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="/" onclick="event.preventDefault(); navigate('home')" class="flex items-center gap-3 group">
        <img src="/static/img/logo.svg" alt="Phone Store" class="h-10 w-10 rounded-lg object-contain" crossorigin="anonymous">
        <div>
          <span class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Phone Store</span>
          <span class="block text-xs text-slate-400">Mourouj 6</span>
        </div>
      </a>
      <div class="hidden lg:flex items-center gap-8">
        <a href="/" onclick="event.preventDefault(); navigate('home')" class="nav-link ${Store.currentPage === 'home' ? 'active' : ''}">Accueil</a>
        <a href="/products" onclick="event.preventDefault(); navigate('products')" class="nav-link ${Store.currentPage === 'products' ? 'active' : ''}">Produits</a>
        <a href="#services" onclick="event.preventDefault(); scrollToSection('services')" class="nav-link">Services</a>
        <a href="#reviews" onclick="event.preventDefault(); scrollToSection('reviews')" class="nav-link">Avis</a>
        <a href="#contact" onclick="event.preventDefault(); scrollToSection('contact')" class="nav-link">Contact</a>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden md:flex relative">
          <input type="text" placeholder="Rechercher..." class="input-field py-2 pl-9 pr-4 w-48 text-sm rounded-full" id="nav-search" onkeydown="if(event.key==='Enter'){Store.searchQuery=this.value;navigate('products');}">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
        </div>
        <a href="/cart" onclick="event.preventDefault(); navigate('cart')" class="btn-icon relative">
          <i class="fas fa-shopping-bag"></i>
          <span class="cart-count cart-badge" style="display:none">0</span>
        </a>
        <button class="btn-icon lg:hidden" onclick="toggleMobileMenu()">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <button class="absolute top-6 right-6 text-2xl text-slate-400 hover:text-white" onclick="toggleMobileMenu()"><i class="fas fa-times"></i></button>
    <a href="/" onclick="event.preventDefault(); toggleMobileMenu(); navigate('home')">Accueil</a>
    <a href="/products" onclick="event.preventDefault(); toggleMobileMenu(); navigate('products')">Produits</a>
    <a href="#services" onclick="event.preventDefault(); toggleMobileMenu(); scrollToSection('services')">Services</a>
    <a href="#reviews" onclick="event.preventDefault(); toggleMobileMenu(); scrollToSection('reviews')">Avis</a>
    <a href="#contact" onclick="event.preventDefault(); toggleMobileMenu(); scrollToSection('contact')">Contact</a>
    <a href="/cart" onclick="event.preventDefault(); toggleMobileMenu(); navigate('cart')">
      <i class="fas fa-shopping-bag mr-2"></i>Panier (<span class="cart-count">0</span>)
    </a>
  </div>`;
}

function scrollToSection(id) {
  if (Store.currentPage !== 'home') {
    navigate('home');
    setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 300);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('open');
}

function initNavbar() {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    lastScroll = window.scrollY;
  });
}

function initMobileMenu() {
  // close on outside click
}

// ─── HOME PAGE ───
function renderHomePage() {
  return renderHero() + renderMarquee() + renderFeaturedProducts() +
    renderServices() + renderWhyChooseUs() + renderCounters() +
    renderCategories() + renderReviews() + renderFAQSection() +
    renderContactSection() + renderNewsletter() + renderWhatsApp();
}

// ─── HERO ───
function renderHero() {
  return `
  <section class="hero-bg relative min-h-screen flex items-center overflow-hidden" id="hero">
    <div class="hero-grid absolute inset-0"></div>
    <div class="hero-orb w-96 h-96 bg-blue-600" style="top:-10%;left:-5%;"></div>
    <div class="hero-orb w-72 h-72 bg-blue-500" style="bottom:10%;right:-5%;"></div>
    <div class="hero-orb w-48 h-48 bg-indigo-600" style="top:40%;right:20%;"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
      <div class="animate-fade-up">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span class="section-subtitle">Bienvenue chez Phone Store</span>
        </div>
        <h1 class="hero-title text-5xl lg:text-7xl font-black leading-tight mb-6">
          <span class="text-white">Votre Expert</span><br>
          <span class="gradient-text">Tech & Réparation</span>
        </h1>
        <p class="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
          Accessoires premium, réparation professionnelle de téléphones et ordinateurs.
          Qualité garantie et service rapide à El Mourouj.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="/products" onclick="event.preventDefault(); navigate('products')" class="btn-primary text-lg px-8 py-4">
            <i class="fas fa-shopping-bag"></i> Nos Produits
          </a>
          <a href="#services" onclick="event.preventDefault(); scrollToSection('services')" class="btn-outline text-lg px-8 py-4">
            <i class="fas fa-tools"></i> Nos Services
          </a>
        </div>
        <div class="flex items-center gap-8 mt-10">
          <div class="flex -space-x-3">
            ${[1,2,3,4].map(i => `<div class="w-10 h-10 rounded-full border-2 border-dark-950 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold">${String.fromCharCode(64+i)}</div>`).join('')}
          </div>
          <div>
            <div class="flex text-yellow-400 text-sm gap-0.5">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
            <span class="text-slate-400 text-sm">+500 clients satisfaits</span>
          </div>
        </div>
      </div>
      <div class="hidden lg:flex justify-center animate-fade-right">
        <div class="relative">
          <div class="w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 flex items-center justify-center animate-float">
            <img src="/static/img/logo.svg" alt="Phone Store Logo" class="w-48 h-48 object-contain drop-shadow-2xl" crossorigin="anonymous">
          </div>
          <div class="absolute -top-6 -right-6 glass-card p-4 animate-float-slow" style="animation-delay:1s">
            <div class="flex items-center gap-2">
              <i class="fas fa-bolt text-yellow-400"></i>
              <span class="text-sm font-semibold">Réparation Rapide</span>
            </div>
          </div>
          <div class="absolute -bottom-4 -left-8 glass-card p-4 animate-float-slow" style="animation-delay:2s">
            <div class="flex items-center gap-2">
              <i class="fas fa-shield-halved text-green-400"></i>
              <span class="text-sm font-semibold">Garantie Qualité</span>
            </div>
          </div>
          <div class="absolute top-1/2 -right-12 glass-card p-4 animate-float-slow" style="animation-delay:0.5s">
            <div class="flex items-center gap-2">
              <i class="fas fa-truck-fast text-blue-400"></i>
              <span class="text-sm font-semibold">Livraison</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <i class="fas fa-chevron-down text-slate-500 text-xl"></i>
    </div>
  </section>`;
}

// ─── MARQUEE ───
function renderMarquee() {
  const items = ['📱 Réparation iPhone', '💻 Réparation PC', '🔌 Chargeurs', '🎧 Écouteurs', '⌚ Montres Connectées', '🎮 Gaming', '🛡️ Protection Écran', '📦 Coques & Étuis', '💡 Ring Lights', '🔊 EarPods', '🖱️ Accessoires PC', '🔋 Câbles USB'];
  const track = items.map(i => `<span class="inline-flex items-center gap-3 px-8 text-slate-400 text-lg font-medium">${i}<span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span></span>`).join('');
  return `
  <div class="py-6 border-y border-slate-800/50">
    <div class="marquee-container">
      <div class="marquee-track">${track}${track}</div>
    </div>
  </div>
  <div class="py-4 bg-blue-600/5">
    <div class="marquee-container">
      <div class="marquee-track-reverse">
        ${['Service Rapide ⚡', 'Prix Imbattables 💰', 'Qualité Premium ✨', 'Garantie ✅', 'Support Technique 🛠️', 'Livraison 🚀', 'Satisfaction 100% 💯', 'Professionnel 🏆'].map(i =>
          `<span class="inline-flex items-center gap-3 px-8 text-blue-400/70 text-sm font-semibold uppercase tracking-wider">${i}<span class="w-1 h-1 bg-blue-400 rounded-full"></span></span>`
        ).join('')}
        ${['Service Rapide ⚡', 'Prix Imbattables 💰', 'Qualité Premium ✨', 'Garantie ✅', 'Support Technique 🛠️', 'Livraison 🚀', 'Satisfaction 100% 💯', 'Professionnel 🏆'].map(i =>
          `<span class="inline-flex items-center gap-3 px-8 text-blue-400/70 text-sm font-semibold uppercase tracking-wider">${i}<span class="w-1 h-1 bg-blue-400 rounded-full"></span></span>`
        ).join('')}
      </div>
    </div>
  </div>`;
}

// ─── FEATURED PRODUCTS ───
function renderFeaturedProducts() {
  return `
  <section class="py-24 px-6 relative" id="featured">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Sélection Premium</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Produits <span class="gradient-text">Populaires</span></h2>
        <p class="text-slate-400 max-w-2xl mx-auto">Découvrez notre sélection de produits les plus appréciés par nos clients</p>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="swiper featured-swiper reveal">
        <div class="swiper-wrapper" id="featured-swiper-wrapper">
          ${renderProductSkeletons(6)}
        </div>
        <div class="swiper-pagination mt-8"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
      <div class="text-center mt-12">
        <a href="/products" onclick="event.preventDefault(); navigate('products')" class="btn-outline">
          Voir tous les produits <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </section>`;
}

function renderProductSkeletons(count) {
  return Array(count).fill(0).map(() => `
    <div class="swiper-slide"><div class="product-card"><div class="skeleton h-48 w-full"></div><div class="p-5"><div class="skeleton h-4 w-3/4 mb-3"></div><div class="skeleton h-3 w-1/2 mb-4"></div><div class="skeleton h-8 w-full"></div></div></div></div>
  `).join('');
}

function renderProductCard(p) {
  const discount = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
  const imgSrc = p.image_url && !p.image_url.endsWith('.svg') ? p.image_url : getProductSVG(p.name, p.category_slug || '');
  return `
  <div class="product-card group">
    <div class="product-img">
      ${discount > 0 ? `<span class="product-badge badge-sale">-${discount}%</span>` : ''}
      ${p.featured ? '<span class="product-badge badge-hot" style="left:auto;right:0.75rem">⭐ Top</span>' : ''}
      <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.src='${getProductSVG(p.name, p.category_slug || '')}'">
      <div class="product-quick-view">
        <button onclick='showQuickView(${JSON.stringify(p).replace(/'/g, "&#39;")})' class="btn-primary btn-sm"><i class="fas fa-eye mr-1"></i>Aperçu</button>
      </div>
    </div>
    <div class="p-5">
      <p class="text-xs text-blue-400 mb-1">${p.category_name || ''}</p>
      <h3 class="font-semibold text-white mb-2 line-clamp-2 text-sm">${p.name}</h3>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xl font-bold text-blue-400">${p.price.toFixed(2)} DT</span>
        ${p.old_price ? `<span class="text-sm text-slate-500 line-through">${p.old_price.toFixed(2)} DT</span>` : ''}
      </div>
      <button onclick='Store.addToCart(${JSON.stringify({id:p.id,name:p.name,price:p.price,image_url:p.image_url}).replace(/'/g,"&#39;")})' class="btn-primary w-full text-sm justify-center ${!p.in_stock ? 'opacity-50 pointer-events-none' : ''}">
        <i class="fas fa-cart-plus"></i> ${p.in_stock ? 'Ajouter au panier' : 'Rupture de stock'}
      </button>
    </div>
  </div>`;
}

// ─── QUICK VIEW MODAL ───
function showQuickView(product) {
  const imgSrc = product.image_url && !product.image_url.endsWith('.svg') ? product.image_url : getProductSVG(product.name, product.category_slug || '');
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
  <div class="modal-content p-6">
    <div class="flex justify-between items-start mb-6">
      <h3 class="text-xl font-bold">${product.name}</h3>
      <button onclick="this.closest('.modal-overlay').remove()" class="text-slate-400 hover:text-white text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-1/2 bg-dark-800 rounded-xl p-8 flex items-center justify-center">
        <img src="${imgSrc}" alt="${product.name}" class="max-h-48 object-contain">
      </div>
      <div class="md:w-1/2">
        <p class="text-blue-400 text-sm mb-2">${product.category_name || ''}</p>
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl font-bold text-blue-400">${product.price.toFixed(2)} DT</span>
          ${product.old_price ? `<span class="text-lg text-slate-500 line-through">${product.old_price.toFixed(2)} DT</span><span class="text-sm bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">-${discount}%</span>` : ''}
        </div>
        <p class="text-slate-400 text-sm leading-relaxed mb-4">${product.description || 'Produit de qualité premium disponible chez Phone Store Mourouj 6.'}</p>
        <div class="flex items-center gap-2 mb-6">
          <span class="inline-flex items-center gap-1 text-sm ${product.in_stock ? 'text-green-400' : 'text-red-400'}">
            <i class="fas ${product.in_stock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            ${product.in_stock ? 'En stock' : 'Rupture de stock'}
          </span>
        </div>
        <button onclick='Store.addToCart(${JSON.stringify({id:product.id,name:product.name,price:product.price,image_url:product.image_url}).replace(/'/g,"&#39;")}); this.closest(".modal-overlay").remove()' class="btn-primary w-full justify-center ${!product.in_stock ? 'opacity-50 pointer-events-none' : ''}">
          <i class="fas fa-cart-plus"></i> Ajouter au panier
        </button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

// ─── SERVICES ───
function renderServices() {
  const services = [
    { icon: 'fa-mobile-screen-button', title: 'Réparation Téléphone', desc: 'Réparation écran, batterie, connecteur de charge, et plus. Service rapide et garanti.' },
    { icon: 'fa-laptop-code', title: 'Réparation Ordinateur', desc: 'Diagnostic complet, réparation hardware et software, nettoyage et optimisation.' },
    { icon: 'fa-bag-shopping', title: 'Vente Accessoires', desc: 'Large gamme d\'accessoires premium : coques, chargeurs, écouteurs, et plus.' },
    { icon: 'fa-headset', title: 'Support Technique', desc: 'Assistance technique professionnelle et conseils personnalisés pour tous vos appareils.' }
  ];
  return `
  <section class="py-24 px-6 relative" id="services">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent"></div>
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Ce que nous offrons</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Nos <span class="gradient-text">Services</span></h2>
        <p class="text-slate-400 max-w-2xl mx-auto">Des services professionnels pour tous vos besoins tech</p>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${services.map((s, i) => `
          <div class="glass-card p-8 text-center group reveal" style="animation-delay:${i*0.15}s">
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i class="fas ${s.icon} text-2xl text-blue-400"></i>
            </div>
            <h3 class="text-lg font-bold mb-3">${s.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">${s.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  <div class="section-separator"></div>`;
}

// ─── WHY CHOOSE US ───
function renderWhyChooseUs() {
  const reasons = [
    { icon: 'fa-award', title: 'Expertise Certifiée', desc: 'Techniciens qualifiés avec des années d\'expérience' },
    { icon: 'fa-clock', title: 'Service Rapide', desc: 'Réparation express, la plupart en moins de 30 minutes' },
    { icon: 'fa-hand-holding-dollar', title: 'Meilleurs Prix', desc: 'Prix compétitifs et transparents, sans surprises' },
    { icon: 'fa-shield-check', title: 'Garantie Qualité', desc: 'Tous nos produits et réparations sont garantis' },
    { icon: 'fa-face-smile', title: 'Satisfaction Client', desc: '+500 clients satisfaits nous font confiance' },
    { icon: 'fa-location-dot', title: 'Proximité', desc: 'Facilement accessible à El Mourouj' }
  ];
  return `
  <section class="py-24 px-6" id="why-us">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Pourquoi nous</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Pourquoi <span class="gradient-text">Nous Choisir</span></h2>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${reasons.map((r, i) => `
          <div class="glass-card p-6 flex items-start gap-4 group reveal" style="animation-delay:${i*0.1}s">
            <div class="w-12 h-12 shrink-0 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
              <i class="fas ${r.icon} text-blue-400"></i>
            </div>
            <div>
              <h3 class="font-bold mb-1">${r.title}</h3>
              <p class="text-sm text-slate-400">${r.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// ─── COUNTERS ───
function renderCounters() {
  return `
  <section class="py-16 px-6 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-blue-900/10"></div>
    <div class="max-w-5xl mx-auto relative z-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${[
          { num: 500, suffix: '+', label: 'Clients Satisfaits', icon: 'fa-users' },
          { num: 2000, suffix: '+', label: 'Produits Vendus', icon: 'fa-box' },
          { num: 1000, suffix: '+', label: 'Réparations', icon: 'fa-screwdriver-wrench' },
          { num: 5, suffix: ' ⭐', label: 'Note Moyenne', icon: 'fa-star' }
        ].map(c => `
          <div class="counter-card glass-card reveal">
            <i class="fas ${c.icon} text-2xl text-blue-400 mb-3"></i>
            <div class="counter-number" data-target="${c.num}" data-suffix="${c.suffix}">0${c.suffix}</div>
            <p class="text-slate-400 text-sm mt-1">${c.label}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// ─── CATEGORIES ───
function renderCategories() {
  return `
  <section class="py-24 px-6" id="categories">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Explorer</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Nos <span class="gradient-text">Catégories</span></h2>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="categories-grid">
        ${renderCategorySkeletons(8)}
      </div>
    </div>
  </section>
  <div class="section-separator"></div>`;
}

function renderCategorySkeletons(count) {
  return Array(count).fill(0).map(() => `<div class="glass-card p-6 text-center"><div class="skeleton w-12 h-12 rounded-xl mx-auto mb-3"></div><div class="skeleton h-4 w-2/3 mx-auto"></div></div>`).join('');
}

function renderCategoryCard(cat) {
  return `
  <a href="/products" onclick="event.preventDefault(); Store.currentCategory='${cat.slug}'; navigate('products')" class="glass-card p-6 text-center cursor-pointer group reveal">
    <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
      <i class="fas ${cat.icon} text-xl text-blue-400"></i>
    </div>
    <h3 class="font-semibold text-sm">${cat.name}</h3>
  </a>`;
}

// ─── REVIEWS ───
function renderReviews() {
  const reviews = [
    { text: "Je tiens à vous remercier pour votre excellent service. Votre professionnalisme et votre sérieux donnent vraiment confiance. Merci encore pour votre accueil et votre efficacité !", author: "Ranim Bach", rating: 5 },
    { text: "Best phone repair shop. Very punctual, serious and helpful staff, and good prices. I highly recommend it", author: "Sana El Kadhi", rating: 5 },
    { text: "Excellent customer service tfol metrabi w les prix ahsen haja fel zone", author: "Kalil Zouaghia", rating: 5 }
  ];
  return `
  <section class="py-24 px-6" id="reviews">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Témoignages</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Ce que disent <span class="gradient-text">Nos Clients</span></h2>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="swiper reviews-swiper reveal">
        <div class="swiper-wrapper">
          ${reviews.map(r => `
            <div class="swiper-slide">
              <div class="testimonial-card">
                <div class="flex text-yellow-400 gap-1 mb-4">${'<i class="fas fa-star"></i>'.repeat(r.rating)}</div>
                <p class="text-slate-300 leading-relaxed mb-6 italic">"${r.text}"</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold">${r.author.charAt(0)}</div>
                  <div>
                    <p class="font-semibold text-sm">${r.author}</p>
                    <p class="text-xs text-slate-500">Client vérifié</p>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="swiper-pagination mt-8"></div>
      </div>
    </div>
  </section>`;
}

// ─── FAQ ───
function renderFAQSection() {
  const faqs = [
    { q: "Combien de temps prend une réparation d'écran ?", a: "La plupart des réparations d'écran sont effectuées en 30 à 60 minutes selon le modèle de votre appareil." },
    { q: "Offrez-vous une garantie sur les réparations ?", a: "Oui, toutes nos réparations sont garanties. La durée de garantie dépend du type de réparation effectuée." },
    { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons le paiement en espèces et par virement bancaire. Le paiement s'effectue à la livraison ou en boutique." },
    { q: "Livrez-vous à domicile ?", a: "Oui, nous proposons la livraison à domicile dans la région d'El Mourouj et ses environs." },
    { q: "Comment puis-je suivre ma commande ?", a: "Après confirmation de votre commande, vous recevrez des mises à jour par téléphone. Vous pouvez également nous contacter directement." },
    { q: "Vos produits sont-ils originaux ?", a: "Nous proposons des produits de haute qualité, certains originaux et certains compatibles premium, toujours au meilleur rapport qualité-prix." }
  ];
  return `
  <section class="py-24 px-6" id="faq">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">FAQ</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Questions <span class="gradient-text">Fréquentes</span></h2>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="space-y-3 reveal">
        ${faqs.map((f, i) => `
          <div class="faq-item glass" data-faq="${i}">
            <div class="faq-question" onclick="toggleFAQ(${i})">
              <span>${f.q}</span>
              <i class="fas fa-chevron-down faq-icon text-blue-400"></i>
            </div>
            <div class="faq-answer">${f.a}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  <div class="section-separator"></div>`;
}

// ─── CONTACT ───
function renderContactSection() {
  return `
  <section class="py-24 px-6" id="contact">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <span class="section-subtitle">Nous contacter</span>
        <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-4">Restons en <span class="gradient-text">Contact</span></h2>
        <div class="section-line mx-auto mt-4"></div>
      </div>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6 reveal-left">
          <div class="glass-card p-6">
            <h3 class="text-lg font-bold mb-6">Informations</h3>
            <div class="space-y-4">
              ${[
                { icon: 'fa-location-dot', label: 'Adresse', value: 'Phone Store, El Mourouj 2074', color: 'text-blue-400' },
                { icon: 'fa-phone', label: 'Téléphone', value: '<a href="tel:+21654663209" class="hover:text-blue-400 transition-colors">54 663 209</a>', color: 'text-green-400' },
                { icon: 'fa-screwdriver-wrench', label: 'Service Technique', value: '<a href="tel:+21651884577" class="hover:text-blue-400 transition-colors">51 884 577</a>', color: 'text-yellow-400' },
                { icon: 'fa-envelope', label: 'Email', value: '<a href="mailto:phonestoremourouj6@gmail.com" class="hover:text-blue-400 transition-colors">phonestoremourouj6@gmail.com</a>', color: 'text-purple-400' }
              ].map(c => `
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 shrink-0 rounded-lg bg-dark-800 flex items-center justify-center"><i class="fas ${c.icon} ${c.color}"></i></div>
                  <div><p class="text-xs text-slate-500 mb-0.5">${c.label}</p><p class="text-sm">${c.value}</p></div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="glass-card p-6">
            <h3 class="text-lg font-bold mb-4">Suivez-nous</h3>
            <div class="flex gap-3">
              <a href="https://www.facebook.com/phonestoremourouj/" target="_blank" rel="noopener" class="btn-icon text-lg"><i class="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/phone_store_mourouj6" target="_blank" rel="noopener" class="btn-icon text-lg"><i class="fab fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@phone_store_mourouj_6" target="_blank" rel="noopener" class="btn-icon text-lg"><i class="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>
        <div class="reveal-right">
          <div class="glass-card overflow-hidden h-full min-h-[400px]">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.5!2d10.17!3d36.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd4b6!2sPhone+Store+El+Mourouj!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn" width="100%" height="100%" style="border:0; min-height:400px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── NEWSLETTER ───
function renderNewsletter() {
  return `
  <section class="py-16 px-6">
    <div class="max-w-3xl mx-auto glass-card p-10 text-center reveal relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent"></div>
      <div class="relative z-10">
        <i class="fas fa-paper-plane text-3xl text-blue-400 mb-4"></i>
        <h3 class="text-2xl font-bold mb-2">Restez Informé</h3>
        <p class="text-slate-400 mb-6 text-sm">Recevez nos offres exclusives et nouveautés</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Votre email..." class="input-field flex-1 rounded-full">
          <button class="btn-primary rounded-full" onclick="showToast('Merci ! Vous êtes inscrit(e) à notre newsletter.')">S'inscrire</button>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── WHATSAPP FLOAT ───
function renderWhatsApp() {
  return `<a href="https://wa.me/21654663209" target="_blank" rel="noopener" class="whatsapp-float" title="Contactez-nous sur WhatsApp"><i class="fab fa-whatsapp"></i></a>`;
}

// ─── FOOTER ───
function renderFooter() {
  return `
  <footer class="border-t border-slate-800/50 pt-16 pb-8 px-6 bg-dark-950">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/static/img/logo.svg" alt="Logo" class="w-10 h-10 rounded-lg object-contain" crossorigin="anonymous">
            <div><span class="font-bold text-lg">Phone Store</span><br><span class="text-xs text-slate-500">Mourouj 6</span></div>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">Votre partenaire de confiance pour tous vos besoins en accessoires tech et réparation.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-sm uppercase tracking-wider text-slate-300">Navigation</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            <li><a href="/" onclick="event.preventDefault(); navigate('home')" class="hover:text-blue-400 transition-colors">Accueil</a></li>
            <li><a href="/products" onclick="event.preventDefault(); navigate('products')" class="hover:text-blue-400 transition-colors">Produits</a></li>
            <li><a href="#services" onclick="event.preventDefault(); scrollToSection('services')" class="hover:text-blue-400 transition-colors">Services</a></li>
            <li><a href="#contact" onclick="event.preventDefault(); scrollToSection('contact')" class="hover:text-blue-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-sm uppercase tracking-wider text-slate-300">Services</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            <li>Réparation Téléphone</li>
            <li>Réparation Ordinateur</li>
            <li>Vente Accessoires</li>
            <li>Support Technique</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-sm uppercase tracking-wider text-slate-300">Contact</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            <li><i class="fas fa-phone mr-2 text-blue-400"></i><a href="tel:+21654663209">54 663 209</a></li>
            <li><i class="fas fa-wrench mr-2 text-blue-400"></i><a href="tel:+21651884577">51 884 577</a></li>
            <li><i class="fas fa-envelope mr-2 text-blue-400"></i><a href="mailto:phonestoremourouj6@gmail.com">Email</a></li>
            <li><i class="fas fa-map-marker-alt mr-2 text-blue-400"></i>El Mourouj 2074</li>
          </ul>
          <div class="flex gap-3 mt-4">
            <a href="https://www.facebook.com/phonestoremourouj/" target="_blank" rel="noopener" class="btn-icon text-sm"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/phone_store_mourouj6" target="_blank" rel="noopener" class="btn-icon text-sm"><i class="fab fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@phone_store_mourouj_6" target="_blank" rel="noopener" class="btn-icon text-sm"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>
      <div class="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>&copy; ${new Date().getFullYear()} Phone Store Mourouj 6. Tous droits réservés.</p>
        <p>Fait avec <i class="fas fa-heart text-red-500 mx-1"></i> en Tunisie 🇹🇳</p>
      </div>
    </div>
  </footer>`;
}

// ─── PRODUCTS PAGE ───
function renderProductsPage() {
  return `
  <section class="pt-28 pb-24 px-6 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl lg:text-4xl font-bold mb-2">Nos <span class="gradient-text">Produits</span></h1>
        <p class="text-slate-400">Découvrez notre gamme complète d'accessoires tech</p>
      </div>
      <div class="flex flex-col lg:flex-row gap-6 mb-8">
        <div class="flex-1">
          <div class="relative">
            <input type="text" id="product-search" placeholder="Rechercher un produit..." class="input-field pl-10 rounded-full" value="${Store.searchQuery}" oninput="filterProducts()">
            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"></i>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 mb-8" id="category-filters">
        <button class="cat-pill ${!Store.currentCategory ? 'active' : ''}" onclick="Store.currentCategory=''; filterProducts()">
          <i class="fas fa-th-large"></i> Tout
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="products-grid">
        ${renderProductSkeletons(8)}
      </div>
    </div>
  </section>`;
}

async function filterProducts() {
  const search = document.getElementById('product-search')?.value || '';
  Store.searchQuery = search;
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = Store.products;
  if (Store.currentCategory) {
    filtered = filtered.filter(p => p.category_slug === Store.currentCategory);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-16"><i class="fas fa-search text-4xl text-slate-600 mb-4"></i><p class="text-slate-400">Aucun produit trouvé</p></div>';
  } else {
    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  }
}

// ─── CART PAGE ───
function renderCartPage() {
  if (Store.cart.length === 0) {
    return `
    <section class="pt-28 pb-24 px-6 min-h-screen flex items-center justify-center">
      <div class="text-center">
        <i class="fas fa-shopping-bag text-6xl text-slate-700 mb-6"></i>
        <h2 class="text-2xl font-bold mb-2">Votre panier est vide</h2>
        <p class="text-slate-400 mb-6">Explorez nos produits et ajoutez vos favoris</p>
        <a href="/products" onclick="event.preventDefault(); navigate('products')" class="btn-primary"><i class="fas fa-shopping-bag"></i> Voir les produits</a>
      </div>
    </section>`;
  }
  return `
  <section class="pt-28 pb-24 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Mon <span class="gradient-text">Panier</span></h1>
      <div class="space-y-4 mb-8">
        ${Store.cart.map(item => {
          const imgSrc = item.image_url && !item.image_url.endsWith('.svg') ? item.image_url : getProductSVG(item.product_name, '');
          return `
          <div class="glass-card p-4 flex items-center gap-4">
            <div class="w-20 h-20 shrink-0 rounded-lg bg-dark-800 flex items-center justify-center overflow-hidden">
              <img src="${imgSrc}" alt="${item.product_name}" class="max-h-16 object-contain">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm truncate">${item.product_name}</h3>
              <p class="text-blue-400 font-bold">${item.price.toFixed(2)} DT</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="Store.updateQty(${item.product_id}, ${item.quantity - 1}); navigate('cart', false)" class="btn-icon btn-sm text-xs w-8 h-8">-</button>
              <span class="w-8 text-center font-semibold">${item.quantity}</span>
              <button onclick="Store.updateQty(${item.product_id}, ${item.quantity + 1}); navigate('cart', false)" class="btn-icon btn-sm text-xs w-8 h-8">+</button>
            </div>
            <span class="font-bold text-sm w-20 text-right">${(item.price * item.quantity).toFixed(2)} DT</span>
            <button onclick="Store.removeFromCart(${item.product_id}); navigate('cart', false)" class="text-red-400 hover:text-red-300 transition-colors"><i class="fas fa-trash-alt"></i></button>
          </div>`;
        }).join('')}
      </div>
      <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-slate-400">Sous-total</span>
          <span class="font-bold text-lg">${Store.getCartTotal().toFixed(2)} DT</span>
        </div>
        <div class="flex justify-between items-center mb-6">
          <span class="text-slate-400">Livraison</span>
          <span class="text-green-400 font-semibold">À déterminer</span>
        </div>
        <div class="flex justify-between items-center border-t border-slate-700 pt-4 mb-6">
          <span class="text-lg font-bold">Total</span>
          <span class="text-2xl font-bold text-blue-400">${Store.getCartTotal().toFixed(2)} DT</span>
        </div>
        <div class="flex gap-3">
          <a href="/products" onclick="event.preventDefault(); navigate('products')" class="btn-outline flex-1 justify-center"><i class="fas fa-arrow-left"></i> Continuer</a>
          <a href="/checkout" onclick="event.preventDefault(); navigate('checkout')" class="btn-primary flex-1 justify-center"><i class="fas fa-credit-card"></i> Commander</a>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── CHECKOUT PAGE ───
function renderCheckoutPage() {
  if (Store.cart.length === 0) { navigate('cart'); return ''; }
  return `
  <section class="pt-28 pb-24 px-6 min-h-screen">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Confirmer la <span class="gradient-text">Commande</span></h1>
      <div class="glass-card p-6 mb-6">
        <h3 class="font-bold mb-4">Récapitulatif</h3>
        <div class="space-y-2 mb-4">
          ${Store.cart.map(i => `
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">${i.product_name} x${i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)} DT</span>
            </div>
          `).join('')}
        </div>
        <div class="border-t border-slate-700 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span class="text-blue-400">${Store.getCartTotal().toFixed(2)} DT</span>
        </div>
      </div>
      <form id="checkout-form" onsubmit="submitOrder(event)" class="glass-card p-6 space-y-4">
        <h3 class="font-bold mb-2">Vos informations</h3>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Nom complet *</label>
          <input type="text" name="customer_name" required class="input-field" placeholder="Votre nom complet">
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Numéro de téléphone *</label>
          <input type="tel" name="customer_phone" required class="input-field" placeholder="XX XXX XXX">
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Adresse de livraison *</label>
          <textarea name="customer_address" required class="input-field" placeholder="Votre adresse complète"></textarea>
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Note (optionnel)</label>
          <textarea name="customer_note" class="input-field" placeholder="Instructions spéciales..."></textarea>
        </div>
        <button type="submit" class="btn-primary w-full justify-center text-lg py-4" id="submit-order-btn">
          <i class="fas fa-check-circle"></i> Confirmer la commande
        </button>
      </form>
    </div>
  </section>`;
}

async function submitOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-order-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
  btn.disabled = true;

  const form = new FormData(e.target);
  const data = {
    customer_name: form.get('customer_name'),
    customer_phone: form.get('customer_phone'),
    customer_address: form.get('customer_address'),
    customer_note: form.get('customer_note') || '',
    items: Store.cart.map(i => ({
      product_id: i.product_id,
      product_name: i.product_name,
      price: i.price,
      quantity: i.quantity
    }))
  };

  try {
    const res = await API.post('/api/orders', data);
    if (res.ok) {
      Store.cart = [];
      Store.saveCart();
      showToast(`Commande #${res.data.order_id} confirmée ! Nous vous contacterons bientôt.`, 'success');
      setTimeout(() => navigate('home'), 2000);
    } else {
      showToast(res.error || 'Erreur lors de la commande', 'error');
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmer la commande';
      btn.disabled = false;
    }
  } catch {
    showToast('Erreur de connexion. Veuillez réessayer.', 'error');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmer la commande';
    btn.disabled = false;
  }
}

// ═══════════════════════════════════════════
//   ADMIN DASHBOARD
// ═══════════════════════════════════════════

let adminView = 'dashboard';
let adminPollingInterval = null;

function renderAdminLogin() {
  return `
  <div class="min-h-screen flex items-center justify-center px-6 bg-dark-950">
    <div class="glass-card p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/static/img/logo.svg" alt="Logo" class="w-16 h-16 rounded-xl mx-auto mb-4 object-contain" crossorigin="anonymous">
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
        <p class="text-slate-400 text-sm">Phone Store Mourouj 6</p>
      </div>
      <form onsubmit="adminLogin(event)" class="space-y-4">
        <input type="text" name="username" placeholder="Nom d'utilisateur" required class="input-field">
        <input type="password" name="password" placeholder="Mot de passe" required class="input-field">
        <button type="submit" class="btn-primary w-full justify-center" id="admin-login-btn">
          <i class="fas fa-sign-in-alt"></i> Se connecter
        </button>
      </form>
      <div class="text-center mt-6">
        <a href="/" onclick="event.preventDefault(); navigate('home')" class="text-sm text-slate-400 hover:text-blue-400 transition-colors">
          <i class="fas fa-arrow-left mr-1"></i> Retour au site
        </a>
      </div>
    </div>
  </div>`;
}

async function adminLogin(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const btn = document.getElementById('admin-login-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
  try {
    const res = await API.post('/api/admin/login', {
      username: form.get('username'),
      password: form.get('password')
    });
    if (res.ok) {
      Store.adminToken = res.data.token;
      localStorage.setItem('ps_admin_token', res.data.token);
      showToast('Connexion réussie !');
      renderApp();
    } else {
      showToast('Identifiants invalides', 'error');
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
    }
  } catch {
    showToast('Erreur de connexion', 'error');
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
  }
}

function renderAdminDashboard() {
  return `
  <div class="flex min-h-screen">
    <aside class="admin-sidebar w-64 p-4 hidden lg:block shrink-0">
      <div class="flex items-center gap-3 mb-8 p-2">
        <img src="/static/img/logo.svg" alt="Logo" class="w-10 h-10 rounded-lg object-contain" crossorigin="anonymous">
        <div><span class="font-bold text-sm">Admin Panel</span><br><span class="text-xs text-slate-500">Phone Store</span></div>
      </div>
      <nav class="space-y-1">
        <a onclick="switchAdminView('dashboard')" class="admin-nav-item ${adminView === 'dashboard' ? 'active' : ''}"><i class="fas fa-chart-pie w-5"></i>Dashboard</a>
        <a onclick="switchAdminView('orders')" class="admin-nav-item ${adminView === 'orders' ? 'active' : ''} relative"><i class="fas fa-shopping-cart w-5"></i>Commandes<span class="notif-badge admin-unseen-badge" style="display:none;position:static;margin-left:auto">0</span></a>
        <a onclick="switchAdminView('products')" class="admin-nav-item ${adminView === 'products' ? 'active' : ''}"><i class="fas fa-box w-5"></i>Produits</a>
        <a onclick="switchAdminView('categories')" class="admin-nav-item ${adminView === 'categories' ? 'active' : ''}"><i class="fas fa-tags w-5"></i>Catégories</a>
      </nav>
      <div class="mt-auto pt-8 space-y-1">
        <a href="/" onclick="event.preventDefault(); navigate('home')" class="admin-nav-item"><i class="fas fa-external-link-alt w-5"></i>Voir le site</a>
        <a onclick="adminLogout()" class="admin-nav-item text-red-400"><i class="fas fa-sign-out-alt w-5"></i>Déconnexion</a>
      </div>
    </aside>
    <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div class="lg:hidden flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Admin</h2>
        <div class="flex gap-2">
          <button onclick="switchAdminView('dashboard')" class="btn-icon btn-sm ${adminView==='dashboard'?'!bg-blue-600 !text-white':''}"><i class="fas fa-chart-pie"></i></button>
          <button onclick="switchAdminView('orders')" class="btn-icon btn-sm ${adminView==='orders'?'!bg-blue-600 !text-white':''}"><i class="fas fa-shopping-cart"></i></button>
          <button onclick="switchAdminView('products')" class="btn-icon btn-sm ${adminView==='products'?'!bg-blue-600 !text-white':''}"><i class="fas fa-box"></i></button>
          <button onclick="switchAdminView('categories')" class="btn-icon btn-sm ${adminView==='categories'?'!bg-blue-600 !text-white':''}"><i class="fas fa-tags"></i></button>
          <button onclick="adminLogout()" class="btn-icon btn-sm text-red-400"><i class="fas fa-sign-out-alt"></i></button>
        </div>
      </div>
      <div id="admin-content">${getAdminContent()}</div>
    </main>
  </div>`;
}

function switchAdminView(view) {
  adminView = view;
  const content = document.getElementById('admin-content');
  if (content) {
    content.innerHTML = getAdminContent();
    loadAdminData();
  } else {
    renderApp();
  }
}

function getAdminContent() {
  switch (adminView) {
    case 'orders': return '<div id="admin-orders"><div class="text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i></div></div>';
    case 'products': return '<div id="admin-products"><div class="text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i></div></div>';
    case 'categories': return '<div id="admin-categories"><div class="text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i></div></div>';
    default: return '<div id="admin-stats"><div class="text-center py-12"><i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i></div></div>';
  }
}

async function loadAdminData() {
  if (adminView === 'dashboard') await loadAdminStats();
  else if (adminView === 'orders') await loadAdminOrders();
  else if (adminView === 'products') await loadAdminProducts();
  else if (adminView === 'categories') await loadAdminCategories();
}

async function loadAdminStats() {
  const el = document.getElementById('admin-stats');
  if (!el) return;
  try {
    const res = await API.get('/api/admin/stats');
    if (!res.ok) throw new Error();
    const s = res.data;
    el.innerHTML = `
      <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${[
          { icon: 'fa-box', label: 'Produits', value: s.products, color: 'text-blue-400' },
          { icon: 'fa-shopping-cart', label: 'Commandes', value: s.orders, color: 'text-green-400' },
          { icon: 'fa-coins', label: 'Revenu Total', value: s.revenue.toFixed(2) + ' DT', color: 'text-yellow-400' },
          { icon: 'fa-clock', label: 'En Attente', value: s.pending, color: 'text-orange-400' }
        ].map(stat => `
          <div class="admin-stat-card">
            <div class="flex items-center gap-3 mb-2">
              <i class="fas ${stat.icon} ${stat.color}"></i>
              <span class="text-sm text-slate-400">${stat.label}</span>
            </div>
            <p class="text-2xl font-bold">${stat.value}</p>
          </div>
        `).join('')}
      </div>
      ${s.unseen > 0 ? `<div class="glass-card p-4 border-yellow-500/30 mb-6"><div class="flex items-center gap-3"><i class="fas fa-bell text-yellow-400 animate-bounce"></i><span class="font-semibold">${s.unseen} nouvelle(s) commande(s) non vue(s)</span><button onclick="switchAdminView('orders')" class="btn-primary btn-sm ml-auto">Voir</button></div></div>` : ''}
    `;
  } catch { el.innerHTML = '<p class="text-red-400">Erreur de chargement</p>'; }
}

async function loadAdminOrders() {
  const el = document.getElementById('admin-orders');
  if (!el) return;
  try {
    const res = await API.get('/api/admin/orders');
    if (!res.ok) throw new Error();
    const orders = res.data;
    el.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Commandes (${orders.length})</h2>
      </div>
      ${orders.length === 0 ? '<div class="glass-card p-8 text-center text-slate-400">Aucune commande pour le moment</div>' :
      `<div class="space-y-3">${orders.map(o => `
        <div class="glass-card p-4 ${!o.seen ? 'border-yellow-500/30' : ''}">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              ${!o.seen ? '<span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>' : ''}
              <div>
                <span class="font-bold">#${o.id}</span>
                <span class="text-slate-400 text-sm ml-2">${o.customer_name}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-blue-400">${o.total.toFixed(2)} DT</span>
              <select onchange="updateOrderStatus(${o.id}, this.value)" class="input-field py-1 px-2 text-xs w-auto rounded-lg">
                ${['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s === 'pending' ? '⏳ En attente' : s === 'confirmed' ? '✅ Confirmée' : s === 'shipped' ? '🚚 Expédiée' : s === 'delivered' ? '📦 Livrée' : '❌ Annulée'}</option>`).join('')}
              </select>
              <button onclick="viewOrderDetails(${o.id})" class="btn-icon btn-sm"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
            <span><i class="fas fa-phone mr-1"></i>${o.customer_phone}</span>
            <span><i class="fas fa-map-marker-alt mr-1"></i>${o.customer_address}</span>
            <span><i class="fas fa-clock mr-1"></i>${new Date(o.created_at).toLocaleString('fr-TN')}</span>
          </div>
        </div>
      `).join('')}</div>`}
    `;
  } catch { el.innerHTML = '<p class="text-red-400">Erreur</p>'; }
}

async function updateOrderStatus(id, status) {
  await API.put(`/api/admin/orders/${id}`, { status });
  showToast('Statut mis à jour');
}

async function viewOrderDetails(id) {
  try {
    const res = await API.get(`/api/admin/orders/${id}`);
    if (!res.ok) return;
    const o = res.data;
    // Mark as seen
    if (!o.seen) await API.put(`/api/admin/orders/${id}/seen`);
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) { modal.remove(); loadAdminOrders(); } };
    modal.innerHTML = `
    <div class="modal-content p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold">Commande #${o.id}</h3>
        <button onclick="this.closest('.modal-overlay').remove(); loadAdminOrders();" class="text-slate-400 hover:text-white"><i class="fas fa-times"></i></button>
      </div>
      <div class="space-y-3 mb-4">
        <p><i class="fas fa-user mr-2 text-blue-400"></i><strong>${o.customer_name}</strong></p>
        <p><i class="fas fa-phone mr-2 text-green-400"></i>${o.customer_phone}</p>
        <p><i class="fas fa-map-marker-alt mr-2 text-red-400"></i>${o.customer_address}</p>
        ${o.customer_note ? `<p><i class="fas fa-sticky-note mr-2 text-yellow-400"></i>${o.customer_note}</p>` : ''}
      </div>
      <h4 class="font-bold mb-2">Articles</h4>
      <div class="space-y-2 mb-4">
        ${(o.items || []).map(i => `<div class="flex justify-between text-sm bg-dark-800 p-3 rounded-lg"><span>${i.product_name} x${i.quantity}</span><span class="font-bold">${(i.price * i.quantity).toFixed(2)} DT</span></div>`).join('')}
      </div>
      <div class="border-t border-slate-700 pt-3 flex justify-between font-bold text-lg">
        <span>Total</span><span class="text-blue-400">${o.total.toFixed(2)} DT</span>
      </div>
    </div>`;
    document.body.appendChild(modal);
  } catch { showToast('Erreur', 'error'); }
}

async function loadAdminProducts() {
  const el = document.getElementById('admin-products');
  if (!el) return;
  try {
    const res = await API.get('/api/admin/products');
    if (!res.ok) throw new Error();
    el.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Produits (${res.data.length})</h2>
        <button onclick="showProductForm()" class="btn-primary btn-sm"><i class="fas fa-plus"></i> Ajouter</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-slate-500 border-b border-slate-800">
            <th class="pb-3 pr-4">Produit</th><th class="pb-3 pr-4">Prix</th><th class="pb-3 pr-4">Stock</th><th class="pb-3 pr-4">Catégorie</th><th class="pb-3">Actions</th>
          </tr></thead>
          <tbody>
            ${res.data.map(p => `
              <tr class="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td class="py-3 pr-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center"><img src="${getProductSVG(p.name, '')}" class="w-8 h-8"></div><span class="font-medium">${p.name}</span></div></td>
                <td class="py-3 pr-4 font-bold text-blue-400">${p.price.toFixed(2)} DT</td>
                <td class="py-3 pr-4"><span class="${p.quantity > 0 ? 'text-green-400' : 'text-red-400'}">${p.quantity}</span></td>
                <td class="py-3 pr-4 text-slate-400">${p.category_name || '-'}</td>
                <td class="py-3">
                  <div class="flex gap-2">
                    <button onclick='showProductForm(${JSON.stringify(p).replace(/'/g,"&#39;")})' class="btn-icon btn-sm"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteProduct(${p.id})" class="btn-icon btn-sm text-red-400 hover:!bg-red-600 hover:!text-white"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch { el.innerHTML = '<p class="text-red-400">Erreur</p>'; }
}

function showProductForm(product = null) {
  const isEdit = !!product;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
  <div class="modal-content p-6">
    <h3 class="text-xl font-bold mb-4">${isEdit ? 'Modifier' : 'Ajouter'} un produit</h3>
    <form onsubmit="saveProduct(event, ${isEdit ? product.id : 'null'})" class="space-y-3">
      <input type="text" name="name" value="${isEdit ? product.name : ''}" placeholder="Nom du produit *" required class="input-field">
      <input type="text" name="name_ar" value="${isEdit ? (product.name_ar||'') : ''}" placeholder="Nom en arabe" class="input-field">
      <textarea name="description" placeholder="Description" class="input-field">${isEdit ? (product.description||'') : ''}</textarea>
      <div class="grid grid-cols-2 gap-3">
        <input type="number" name="price" value="${isEdit ? product.price : ''}" placeholder="Prix (DT) *" required step="0.01" class="input-field">
        <input type="number" name="old_price" value="${isEdit && product.old_price ? product.old_price : ''}" placeholder="Ancien prix" step="0.01" class="input-field">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <select name="category_id" class="input-field">
          <option value="">Catégorie</option>
          ${Store.categories.map(c => `<option value="${c.id}" ${isEdit && product.category_id == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
        <input type="number" name="quantity" value="${isEdit ? product.quantity : '100'}" placeholder="Quantité" class="input-field">
      </div>
      <input type="text" name="image_url" value="${isEdit ? (product.image_url||'') : ''}" placeholder="URL image" class="input-field">
      <div class="flex gap-4">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="in_stock" ${!isEdit || product.in_stock ? 'checked' : ''}> En stock</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" ${isEdit && product.featured ? 'checked' : ''}> Mis en avant</label>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn-outline flex-1 justify-center">Annuler</button>
        <button type="submit" class="btn-primary flex-1 justify-center">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>
  </div>`;
  document.body.appendChild(modal);
}

async function saveProduct(e, id) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = {
    name: form.get('name'),
    name_ar: form.get('name_ar') || '',
    description: form.get('description') || '',
    price: parseFloat(form.get('price')),
    old_price: form.get('old_price') ? parseFloat(form.get('old_price')) : null,
    category_id: form.get('category_id') ? parseInt(form.get('category_id')) : null,
    quantity: parseInt(form.get('quantity') || '100'),
    image_url: form.get('image_url') || '',
    in_stock: form.has('in_stock') ? 1 : 0,
    featured: form.has('featured') ? 1 : 0
  };
  try {
    const res = id ? await API.put(`/api/admin/products/${id}`, data) : await API.post('/api/admin/products', data);
    if (res.ok) {
      document.querySelector('.modal-overlay')?.remove();
      showToast(id ? 'Produit modifié' : 'Produit ajouté');
      loadAdminProducts();
      loadAllData(); // Refresh store data
    } else { showToast(res.error || 'Erreur', 'error'); }
  } catch { showToast('Erreur', 'error'); }
}

async function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) return;
  try {
    await API.del(`/api/admin/products/${id}`);
    showToast('Produit supprimé');
    loadAdminProducts();
    loadAllData();
  } catch { showToast('Erreur', 'error'); }
}

async function loadAdminCategories() {
  const el = document.getElementById('admin-categories');
  if (!el) return;
  try {
    const res = await API.get('/api/categories');
    if (!res.ok) throw new Error();
    el.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Catégories (${res.data.length})</h2>
        <button onclick="showCategoryForm()" class="btn-primary btn-sm"><i class="fas fa-plus"></i> Ajouter</button>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        ${res.data.map(c => `
          <div class="glass-card p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center"><i class="fas ${c.icon} text-blue-400"></i></div>
              <div><p class="font-semibold text-sm">${c.name}</p><p class="text-xs text-slate-500">${c.slug}</p></div>
            </div>
            <div class="flex gap-2">
              <button onclick='showCategoryForm(${JSON.stringify(c).replace(/'/g,"&#39;")})' class="btn-icon btn-sm"><i class="fas fa-edit"></i></button>
              <button onclick="deleteCategory(${c.id})" class="btn-icon btn-sm text-red-400"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch { el.innerHTML = '<p class="text-red-400">Erreur</p>'; }
}

function showCategoryForm(cat = null) {
  const isEdit = !!cat;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
  <div class="modal-content p-6">
    <h3 class="text-xl font-bold mb-4">${isEdit ? 'Modifier' : 'Ajouter'} une catégorie</h3>
    <form onsubmit="saveCategory(event, ${isEdit ? cat.id : 'null'})" class="space-y-3">
      <input type="text" name="name" value="${isEdit ? cat.name : ''}" placeholder="Nom *" required class="input-field">
      <input type="text" name="name_ar" value="${isEdit ? (cat.name_ar||'') : ''}" placeholder="Nom en arabe" class="input-field">
      <input type="text" name="slug" value="${isEdit ? cat.slug : ''}" placeholder="Slug (ex: chargers) *" required class="input-field">
      <input type="text" name="icon" value="${isEdit ? cat.icon : 'fa-tag'}" placeholder="Icône FontAwesome" class="input-field">
      <input type="number" name="sort_order" value="${isEdit ? cat.sort_order : '0'}" placeholder="Ordre d'affichage" class="input-field">
      <div class="flex gap-3 pt-2">
        <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn-outline flex-1 justify-center">Annuler</button>
        <button type="submit" class="btn-primary flex-1 justify-center">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>
  </div>`;
  document.body.appendChild(modal);
}

async function saveCategory(e, id) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = { name: form.get('name'), name_ar: form.get('name_ar'), slug: form.get('slug'), icon: form.get('icon') || 'fa-tag', sort_order: parseInt(form.get('sort_order') || '0') };
  try {
    const res = id ? await API.put(`/api/admin/categories/${id}`, data) : await API.post('/api/admin/categories', data);
    if (res.ok) {
      document.querySelector('.modal-overlay')?.remove();
      showToast(id ? 'Catégorie modifiée' : 'Catégorie ajoutée');
      loadAdminCategories();
      loadAllData();
    } else { showToast(res.error || 'Erreur', 'error'); }
  } catch { showToast('Erreur', 'error'); }
}

async function deleteCategory(id) {
  if (!confirm('Supprimer cette catégorie ?')) return;
  try {
    await API.del(`/api/admin/categories/${id}`);
    showToast('Catégorie supprimée');
    loadAdminCategories();
    loadAllData();
  } catch { showToast('Erreur', 'error'); }
}

function adminLogout() {
  Store.adminToken = '';
  localStorage.removeItem('ps_admin_token');
  if (adminPollingInterval) { clearInterval(adminPollingInterval); adminPollingInterval = null; }
  adminView = 'dashboard';
  navigate('home');
}

function initAdminPolling() {
  if (adminPollingInterval) clearInterval(adminPollingInterval);
  adminPollingInterval = setInterval(async () => {
    try {
      const res = await API.get('/api/admin/notifications');
      if (res.ok) {
        document.querySelectorAll('.admin-unseen-badge').forEach(el => {
          if (res.data.count > 0) { el.style.display = 'flex'; el.textContent = res.data.count; }
          else { el.style.display = 'none'; }
        });
      }
    } catch {}
  }, 15000);
  // Load initial data
  loadAdminData();
}

// ═══════════════════════════════════════════
//   INIT & DATA LOADING
// ═══════════════════════════════════════════

async function loadAllData() {
  try {
    const [catRes, prodRes] = await Promise.all([
      API.get('/api/categories'),
      API.get('/api/products')
    ]);

    if (catRes.ok) {
      Store.categories = catRes.data;
      // Render categories grid
      const catGrid = document.getElementById('categories-grid');
      if (catGrid) catGrid.innerHTML = Store.categories.map(c => renderCategoryCard(c)).join('');
      // Render category filters on products page
      const catFilters = document.getElementById('category-filters');
      if (catFilters) {
        catFilters.innerHTML = `<button class="cat-pill ${!Store.currentCategory ? 'active' : ''}" onclick="Store.currentCategory=''; filterProducts()"><i class="fas fa-th-large"></i> Tout</button>` +
          Store.categories.map(c => `<button class="cat-pill ${Store.currentCategory === c.slug ? 'active' : ''}" onclick="Store.currentCategory='${c.slug}'; document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active')); this.classList.add('active'); filterProducts()"><i class="fas ${c.icon}"></i> ${c.name}</button>`).join('');
      }
    }

    if (prodRes.ok) {
      Store.products = prodRes.data;
      // Render featured products swiper
      const featuredWrapper = document.getElementById('featured-swiper-wrapper');
      if (featuredWrapper) {
        const featured = Store.products.filter(p => p.featured);
        featuredWrapper.innerHTML = (featured.length > 0 ? featured : Store.products.slice(0, 8)).map(p =>
          `<div class="swiper-slide">${renderProductCard(p)}</div>`
        ).join('');
        initSwipers();
      }
      // Render products grid
      const prodsGrid = document.getElementById('products-grid');
      if (prodsGrid) filterProducts();
    }
  } catch (e) {
    console.error('Load data error:', e);
  }
}

// ─── SWIPERS ───
function initSwipers() {
  if (typeof Swiper === 'undefined') return;
  document.querySelectorAll('.featured-swiper:not(.swiper-initialized)').forEach(el => {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 16,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: { 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } },
      autoplay: { delay: 4000, disableOnInteraction: false }
    });
  });
  document.querySelectorAll('.reviews-swiper:not(.swiper-initialized)').forEach(el => {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 16,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      autoplay: { delay: 5000, disableOnInteraction: false }
    });
  });
}

// ─── FAQ ───
function initFAQ() {}
function toggleFAQ(idx) {
  const item = document.querySelector(`[data-faq="${idx}"]`);
  if (item) item.classList.toggle('open');
}

// ─── SCROLL ANIMATIONS ───
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

// ─── COUNTER ANIMATION ───
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString() + suffix;
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-number').forEach(el => observer.observe(el));
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  Store.currentPage = getPageFromPath();
  renderApp();
  loadAllData();
});
