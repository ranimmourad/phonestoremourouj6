# Phone Store Mourouj 6

## Project Overview
- **Name**: Phone Store Mourouj 6
- **Goal**: Premium modern corporate website for a Tunisian tech accessories and phone/computer repair store
- **Language**: French primary, Arabic support
- **Stack**: Hono + TypeScript + TailwindCSS (CDN) + Cloudflare D1 + Swiper.js

## Live URLs
- **Sandbox**: Available via GetServiceUrl on port 3000
- **Admin Dashboard**: `/admin` (credentials: admin / admin123)

## Features

### Completed
- **Hero Section** - Large animated hero with glassmorphism, floating cards, gradient text effects
- **Marquee Banners** - Auto-scrolling marquees for products/services (bidirectional)
- **Featured Products Carousel** - Swiper.js carousel with autoplay, pagination, navigation
- **Services Section** - 4 animated service cards (Phone repair, PC repair, Accessories, Support)
- **Why Choose Us** - 6 reasons with glassmorphism cards and icons
- **Animated Counters** - 500+ clients, 2000+ products, 1000+ repairs, 5-star rating
- **Product Categories** - 11 categories with icons (chargers, cables, cases, headphones, etc.)
- **Customer Reviews** - 3 real testimonials in Swiper slider (Ranim Bach, Sana El Kadhi, Kalil Zouaghia)
- **FAQ Section** - 6 expandable questions with smooth animations
- **Contact Section** - Store info, phone numbers, email, social links, Google Maps embed
- **Newsletter Signup** - Email subscription section
- **Floating WhatsApp Button** - Quick contact via WhatsApp
- **Sticky Navbar** - Glass effect on scroll, mobile responsive with hamburger menu
- **Footer** - Full footer with navigation, services, contact, social links

### E-Commerce
- **Product Catalog** - 36 products across 11 categories with search and filter
- **Shopping Cart** - Add/remove items, quantity controls, persistent (localStorage)
- **Checkout Flow** - Customer form (name, phone, address, note) with order submission
- **Product Quick View** - Modal popup with product details
- **Category Filtering** - Filter products by category pills
- **Search** - Real-time product search

### Admin Dashboard
- **Secure Login** - Username/password authentication with token-based sessions
- **Dashboard Stats** - Products count, orders count, revenue, pending orders
- **Order Management** - View all orders, order details, update status (pending/confirmed/shipped/delivered/cancelled)
- **Live Notifications** - Polling for new unseen orders with visual badges
- **Product CRUD** - Add, edit, delete products with all fields
- **Category CRUD** - Add, edit, delete categories
- **Mobile-Friendly** - Responsive admin panel with bottom navigation on mobile

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/init` | Initialize database (creates tables + seeds 36 products) |
| GET | `/api/categories` | List all categories |
| GET | `/api/products` | List products (query: `category`, `search`, `featured`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/orders` | Create order (body: customer_name, phone, address, note, items[]) |

### Admin (requires Bearer token)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Login (body: username, password) |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/orders` | List all orders |
| GET | `/api/admin/orders/:id` | Order details with items |
| PUT | `/api/admin/orders/:id` | Update order status |
| PUT | `/api/admin/orders/:id/seen` | Mark order as seen |
| GET | `/api/admin/notifications` | Unseen orders count + list |
| GET | `/api/admin/products` | List all products (admin) |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

## Data Architecture
- **Database**: Cloudflare D1 (SQLite)
- **Tables**: categories, products, orders, order_items, admin_users
- **Storage**: Cart persisted in localStorage
- **Auth**: Base64-encoded token (username:password)

## Product Categories
1. Chargeurs (Chargers)
2. Câbles USB (USB Cables)
3. Adaptateurs (Adapters)
4. Coques & Étuis (Cases)
5. Protection Écran (Screen Protection)
6. Écouteurs (Headphones)
7. EarPods & AirPods
8. Montres Connectées (Smartwatches)
9. Ring Lights
10. Accessoires Gaming (Gaming Accessories)
11. Accessoires PC (Computer Accessories)

## Store Information
- **Address**: Phone Store, El Mourouj 2074
- **Phone**: 54 663 209
- **Technical Service**: 51 884 577
- **Email**: phonestoremourouj6@gmail.com
- **Facebook**: https://www.facebook.com/phonestoremourouj/
- **Instagram**: https://www.instagram.com/phone_store_mourouj6
- **TikTok**: https://www.tiktok.com/@phone_store_mourouj_6

## Design Features
- Dark modern theme with blue/black/white accents
- Glassmorphism UI cards
- Gradient text effects
- Smooth scroll animations (IntersectionObserver)
- SVG product icons (auto-generated by category)
- Custom scrollbar
- Responsive on all devices
- Swiper.js carousels with autoplay
- FontAwesome icons
- Inter + Tajawal (Arabic) fonts

## Deployment
- **Platform**: Cloudflare Pages
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Swiper.js + D1
- **First Run**: Visit `/api/init` to create tables and seed 36 products
- **Admin**: Visit `/admin` and login with admin / admin123
- **Last Updated**: 2026-05-13
