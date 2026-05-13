import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = { DB?: any }
type Variables = { isAdmin: boolean }

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('/api/*', cors())

// ─── HELPERS ───
function jsonOk(c: any, data: any) { return c.json({ ok: true, data }) }
function jsonErr(c: any, msg: string, status = 400) { return c.json({ ok: false, error: msg }, status) }

// Simple admin auth middleware
async function adminAuth(c: any, next: any) {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return jsonErr(c, 'Unauthorized', 401)
  const token = auth.replace('Bearer ', '')
  try {
    const decoded = atob(token)
    const [user, pass] = decoded.split(':')
    const row = await c.env.DB.prepare('SELECT * FROM admin_users WHERE username=? AND password_hash=?').bind(user, pass).first()
    if (!row) return jsonErr(c, 'Invalid credentials', 401)
    c.set('isAdmin', true)
    await next()
  } catch { return jsonErr(c, 'Invalid token', 401) }
}

// ─── DB INIT (auto-migrate & seed) ───
app.get('/api/init', async (c) => {
  try {
    const db = c.env.DB;
    // Create tables one at a time (D1 exec requires single statements)
    const tables = [
      `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, name_ar TEXT, slug TEXT UNIQUE NOT NULL, icon TEXT DEFAULT 'fa-tag', sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, name_ar TEXT, description TEXT, price REAL NOT NULL, old_price REAL, category_id INTEGER, image_url TEXT, in_stock INTEGER DEFAULT 1, featured INTEGER DEFAULT 0, quantity INTEGER DEFAULT 100, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES categories(id))`,
      `CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, customer_address TEXT NOT NULL, customer_note TEXT, total REAL NOT NULL, status TEXT DEFAULT 'pending', seen INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, product_name TEXT NOT NULL, price REAL NOT NULL, quantity INTEGER NOT NULL DEFAULT 1, FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id))`,
      `CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
    ];
    for (const sql of tables) { await db.prepare(sql).run(); }

    // Check if already seeded
    const check = await db.prepare('SELECT COUNT(*) as c FROM categories').first();
    if (check && (check as any).c > 0) return jsonOk(c, { message: 'Already initialized', categories: (check as any).c });

    // Seed admin
    await db.prepare("INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES ('admin', 'admin123')").run();

    // Seed categories one by one
    const cats: [number,string,string,string,string,number][] = [
      [1,'Chargeurs','شواحن','chargers','fa-bolt',1],
      [2,'Câbles USB','كابلات USB','cables','fa-plug',2],
      [3,'Adaptateurs','محولات','adapters','fa-right-left',3],
      [4,'Coques & Étuis','أغطية الهاتف','cases','fa-mobile-screen',4],
      [5,'Protection Écran','حماية الشاشة','screen-protection','fa-shield-halved',5],
      [6,'Écouteurs','سماعات','headphones','fa-headphones',6],
      [7,'EarPods & AirPods','إيربودز','earpods','fa-earlybirds',7],
      [8,'Montres Connectées','ساعات ذكية','smartwatches','fa-clock',8],
      [9,'Ring Lights','إضاءة','ring-lights','fa-lightbulb',9],
      [10,'Accessoires Gaming','إكسسوارات ألعاب','gaming','fa-gamepad',10],
      [11,'Accessoires PC','إكسسوارات كمبيوتر','computer-accessories','fa-laptop',11]
    ];
    for (const cat of cats) {
      await db.prepare('INSERT OR IGNORE INTO categories (id,name,name_ar,slug,icon,sort_order) VALUES (?,?,?,?,?,?)').bind(...cat).run();
    }

    // Seed products
    const products: [string,string,string,number,number,number,number,number][] = [
      ["Chargeur Rapide USB-C 20W","شاحن سريع USB-C 20W","Chargeur rapide compatible iPhone et Samsung",35,45,1,1,1],
      ["Chargeur Sans Fil Qi 15W","شاحن لاسلكي 15W","Station de charge sans fil compatible tous smartphones Qi",55,70,1,1,1],
      ["Chargeur Voiture Double USB","شاحن سيارة مزدوج","Chargeur allume-cigare 2 ports USB 3.1A",20,28,1,1,0],
      ["Chargeur Magsafe iPhone","شاحن ماجسيف","Chargeur magnetique compatible iPhone 12-15",65,80,1,1,1],
      ["Câble USB-C vers Lightning 1m","كابل USB-C إلى لايتنينغ","Câble certifie charge rapide pour iPhone",15,22,2,1,1],
      ["Câble USB-C vers USB-C 2m","كابل USB-C إلى USB-C","Câble tresse haute qualite charge rapide 60W",18,25,2,1,0],
      ["Câble Micro USB Renforce","كابل مايكرو USB","Câble micro USB tresse en nylon resistant",10,15,2,1,0],
      ["Câble HDMI 4K 2m","كابل HDMI 4K","Câble HDMI haute vitesse 4K 60Hz",25,35,2,1,0],
      ["Adaptateur USB-C vers Jack 3.5mm","محول USB-C إلى جاك","Adaptateur audio haute qualite DAC integre",12,18,3,1,0],
      ["Hub USB-C 6-en-1","موزع USB-C 6 في 1","Hub multiport HDMI + USB 3.0 + SD + USB-C PD",75,95,3,1,1],
      ["Adaptateur OTG USB-C","محول OTG","Connectez cles USB et accessoires a votre smartphone",8,12,3,1,0],
      ["Coque iPhone 15 Pro Transparente","غطاء آيفون 15 برو شفاف","Coque antichoc transparente ultra-fine",25,35,4,1,1],
      ["Coque Samsung S24 Ultra Armor","غطاء سامسونغ S24 مدرع","Protection militaire double couche avec bequille",30,42,4,1,1],
      ["Etui Portefeuille Universel","حافظة محفظة","Etui en cuir PU avec emplacements cartes",22,30,4,1,0],
      ["Verre Trempe iPhone 15 9H","زجاج حماية آيفون 15","Protection ecran 9H anti-rayures bord incurve",15,22,5,1,1],
      ["Verre Trempe Samsung S24","زجاج حماية سامسونغ S24","Film protection ecran qualite premium",15,20,5,1,0],
      ["Film Hydrogel Universel","فيلم هيدروجيل","Protection souple auto-cicatrisante toutes tailles",12,18,5,1,0],
      ["Casque Bluetooth ANC Pro","سماعة بلوتوث ANC","Casque sans fil avec reduction de bruit active",120,160,6,1,1],
      ["Ecouteurs Filaires HiFi","سماعات سلكية HiFi","Ecouteurs intra-auriculaires haute fidelite",25,35,6,1,0],
      ["Casque Gaming RGB","سماعة ألعاب RGB","Casque gaming avec micro et eclairage RGB",85,110,6,1,1],
      ["EarPods Pro Bluetooth 5.3","إيربودز برو بلوتوث","Ecouteurs sans fil ANC 30h autonomie avec boitier",95,130,7,1,1],
      ["EarPods Sport Waterproof","إيربودز رياضية","Ecouteurs sport IP67 resistants eau et sueur",60,80,7,1,0],
      ["EarPods Mini Compacts","إيربودز ميني","Ultra-compacts son cristallin 20h autonomie",45,60,7,1,0],
      ["Montre Connectee Ultra Sport","ساعة ذكية رياضية","GPS cardio SpO2 100+ modes sport 14j batterie",180,250,8,1,1],
      ["Smartwatch Classic Elegante","ساعة ذكية كلاسيكية","Design elegant notifications sante NFC",130,170,8,1,1],
      ["Bracelet Connecte Fitness","سوار رياضي ذكي","Suivi activite sommeil notifications etanche",45,60,8,1,0],
      ["Ring Light 26cm avec Trepied","رينغ لايت 26 سم","Anneau lumineux LED 3 modes trepied extensible 160cm",55,75,9,1,1],
      ["Ring Light 10cm Portable","رينغ لايت صغير","Mini ring light clip pour smartphone rechargeable USB",18,25,9,1,0],
      ["Selfie Ring Light avec Support","رينغ لايت سيلفي","Support telephone + ring light reglable live/TikTok",40,55,9,1,0],
      ["Manette Gaming Bluetooth","يد تحكم بلوتوث","Manette sans fil compatible Android/iOS/PC",65,85,10,1,1],
      ["Support Ventile Smartphone","حامل هاتف مبرد","Refroidisseur gaming avec ventilateur et grip",35,48,10,1,0],
      ["Triggers Gaming Mobile L1R1","أزرار ألعاب موبايل","Gachettes tactiles haute sensibilite PUBG/Free Fire",12,18,10,1,0],
      ["Souris Sans Fil Ergonomique","فأرة لاسلكية","Souris silencieuse 2.4GHz + Bluetooth 3 DPI",35,48,11,1,1],
      ["Clavier Bluetooth Compact","لوحة مفاتيح بلوتوث","Clavier sans fil rechargeable multi-appareils",55,72,11,1,0],
      ["Tapis de Souris XL Gaming","لوحة فأرة كبيرة","Tapis XXL 80x30cm base antiderapante eclairage RGB",30,40,11,1,0],
      ["Support Laptop Reglable","حامل لابتوب","Support en aluminium ventile reglable en hauteur",45,60,11,1,1]
    ];
    for (const p of products) {
      await db.prepare('INSERT INTO products (name,name_ar,description,price,old_price,category_id,in_stock,featured) VALUES (?,?,?,?,?,?,?,?)').bind(...p).run();
    }

    return jsonOk(c, { message: 'Database initialized with ' + products.length + ' products' });
  } catch (e: any) {
    return jsonErr(c, 'Init error: ' + (e.message || String(e)), 500);
  }
});

// ─── PUBLIC API ───

// Get all categories
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM categories ORDER BY sort_order').all()
  return jsonOk(c, results)
})

// Get all products (with optional filters)
app.get('/api/products', async (c) => {
  const cat = c.req.query('category')
  const search = c.req.query('search')
  const featured = c.req.query('featured')
  let sql = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1'
  const params: any[] = []
  if (cat) { sql += ' AND c.slug = ?'; params.push(cat) }
  if (search) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  if (featured === '1') { sql += ' AND p.featured = 1' }
  sql += ' ORDER BY p.featured DESC, p.created_at DESC'
  const stmt = c.env.DB.prepare(sql)
  const { results } = params.length ? await stmt.bind(...params).all() : await stmt.all()
  return jsonOk(c, results)
})

// Get single product
app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id=?').bind(id).first()
  if (!row) return jsonErr(c, 'Product not found', 404)
  return jsonOk(c, row)
})

// Create order
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json()
    const { customer_name, customer_phone, customer_address, customer_note, items } = body
    if (!customer_name || !customer_phone || !customer_address || !items || !items.length) {
      return jsonErr(c, 'Missing required fields')
    }
    let total = 0
    for (const item of items) { total += item.price * item.quantity }
    const orderResult = await c.env.DB.prepare(
      'INSERT INTO orders (customer_name, customer_phone, customer_address, customer_note, total) VALUES (?,?,?,?,?)'
    ).bind(customer_name, customer_phone, customer_address, customer_note || '', total).run()
    const orderId = orderResult.meta.last_row_id
    for (const item of items) {
      await c.env.DB.prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?,?,?,?,?)'
      ).bind(orderId, item.product_id, item.product_name, item.price, item.quantity).run()
      // Decrease stock
      await c.env.DB.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?').bind(item.quantity, item.product_id).run()
    }
    return jsonOk(c, { order_id: orderId, total })
  } catch (e: any) { return jsonErr(c, e.message || 'Order failed') }
})

// ─── ADMIN AUTH ───
app.post('/api/admin/login', async (c) => {
  const { username, password } = await c.req.json()
  const row = await c.env.DB.prepare('SELECT * FROM admin_users WHERE username=? AND password_hash=?').bind(username, password).first()
  if (!row) return jsonErr(c, 'Invalid credentials', 401)
  const token = btoa(`${username}:${password}`)
  return jsonOk(c, { token, username })
})

// ─── ADMIN ROUTES ───

// Dashboard stats
app.get('/api/admin/stats', adminAuth, async (c) => {
  const products = await c.env.DB.prepare('SELECT COUNT(*) as count FROM products').first()
  const orders = await c.env.DB.prepare('SELECT COUNT(*) as count FROM orders').first()
  const revenue = await c.env.DB.prepare('SELECT COALESCE(SUM(total),0) as total FROM orders').first()
  const pending = await c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE status='pending'").first()
  const unseen = await c.env.DB.prepare('SELECT COUNT(*) as count FROM orders WHERE seen=0').first()
  return jsonOk(c, {
    products: products?.count || 0,
    orders: orders?.count || 0,
    revenue: revenue?.total || 0,
    pending: pending?.count || 0,
    unseen: unseen?.count || 0
  })
})

// Admin: get all orders
app.get('/api/admin/orders', adminAuth, async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  return jsonOk(c, results)
})

// Admin: get order details
app.get('/api/admin/orders/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id=?').bind(id).first()
  if (!order) return jsonErr(c, 'Not found', 404)
  const { results: items } = await c.env.DB.prepare('SELECT * FROM order_items WHERE order_id=?').bind(id).all()
  return jsonOk(c, { ...order, items })
})

// Admin: update order status
app.put('/api/admin/orders/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE orders SET status=?, seen=1 WHERE id=?').bind(status, id).run()
  return jsonOk(c, { id, status })
})

// Admin: mark order as seen
app.put('/api/admin/orders/:id/seen', adminAuth, async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('UPDATE orders SET seen=1 WHERE id=?').bind(id).run()
  return jsonOk(c, { id })
})

// Admin: get unseen orders count (for polling notifications)
app.get('/api/admin/notifications', adminAuth, async (c) => {
  const unseen = await c.env.DB.prepare('SELECT COUNT(*) as count FROM orders WHERE seen=0').first()
  const { results } = await c.env.DB.prepare('SELECT id, customer_name, total, created_at FROM orders WHERE seen=0 ORDER BY created_at DESC LIMIT 10').all()
  return jsonOk(c, { count: unseen?.count || 0, orders: results })
})

// Admin: get all products
app.get('/api/admin/products', adminAuth, async (c) => {
  const { results } = await c.env.DB.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC').all()
  return jsonOk(c, results)
})

// Admin: create product
app.post('/api/admin/products', adminAuth, async (c) => {
  const body = await c.req.json()
  const { name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity } = body
  const result = await c.env.DB.prepare(
    'INSERT INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).bind(name, name_ar || '', description || '', price, old_price || null, category_id, image_url || '', in_stock ?? 1, featured ?? 0, quantity ?? 100).run()
  return jsonOk(c, { id: result.meta.last_row_id })
})

// Admin: update product
app.put('/api/admin/products/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity } = body
  await c.env.DB.prepare(
    'UPDATE products SET name=?, name_ar=?, description=?, price=?, old_price=?, category_id=?, image_url=?, in_stock=?, featured=?, quantity=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).bind(name, name_ar || '', description || '', price, old_price || null, category_id, image_url || '', in_stock ?? 1, featured ?? 0, quantity ?? 100, id).run()
  return jsonOk(c, { id })
})

// Admin: delete product
app.delete('/api/admin/products/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run()
  return jsonOk(c, { id })
})

// Admin: manage categories
app.post('/api/admin/categories', adminAuth, async (c) => {
  const { name, name_ar, slug, icon, sort_order } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO categories (name, name_ar, slug, icon, sort_order) VALUES (?,?,?,?,?)'
  ).bind(name, name_ar || '', slug, icon || 'fa-tag', sort_order || 0).run()
  return jsonOk(c, { id: result.meta.last_row_id })
})

app.put('/api/admin/categories/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const { name, name_ar, slug, icon, sort_order } = await c.req.json()
  await c.env.DB.prepare('UPDATE categories SET name=?, name_ar=?, slug=?, icon=?, sort_order=? WHERE id=?')
    .bind(name, name_ar || '', slug, icon || 'fa-tag', sort_order || 0, id).run()
  return jsonOk(c, { id })
})

app.delete('/api/admin/categories/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM categories WHERE id=?').bind(id).run()
  return jsonOk(c, { id })
})

// ─── SERVE PAGES ───

// Main site HTML
const mainPageHTML = (page: string = '') => `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phone Store Mourouj 6 - Accessoires & Réparation</title>
  <meta name="description" content="Phone Store Mourouj 6 - Votre boutique de confiance pour accessoires tech et réparation de téléphones et ordinateurs en Tunisie.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📱</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
  <script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
          dark: { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617' }
        },
        fontFamily: { sans:['Inter','sans-serif'], arabic:['Tajawal','sans-serif'] }
      }
    }
  }
  </script>
  <link rel="stylesheet" href="/static/style.css">
</head>
<body class="bg-dark-950 text-white font-sans antialiased">
  <div id="app"></div>
  <script src="/static/app.js"></script>
</body>
</html>`

app.get('/', (c) => c.html(mainPageHTML()))
app.get('/cart', (c) => c.html(mainPageHTML('cart')))
app.get('/checkout', (c) => c.html(mainPageHTML('checkout')))
app.get('/products', (c) => c.html(mainPageHTML('products')))
app.get('/admin', (c) => c.html(mainPageHTML('admin')))
app.get('/admin/*', (c) => c.html(mainPageHTML('admin')))

export default app
