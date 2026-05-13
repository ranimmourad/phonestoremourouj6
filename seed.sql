-- Admin user (password: admin123 - simple hash for demo)
INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES ('admin', 'admin123');

-- Categories
INSERT OR IGNORE INTO categories (id, name, name_ar, slug, icon, sort_order) VALUES
  (1, 'Chargeurs', 'شواحن', 'chargers', 'fa-bolt', 1),
  (2, 'Câbles USB', 'كابلات USB', 'cables', 'fa-plug', 2),
  (3, 'Adaptateurs', 'محولات', 'adapters', 'fa-right-left', 3),
  (4, 'Coques & Étuis', 'أغطية الهاتف', 'cases', 'fa-mobile-screen', 4),
  (5, 'Protection Écran', 'حماية الشاشة', 'screen-protection', 'fa-shield-halved', 5),
  (6, 'Écouteurs', 'سماعات', 'headphones', 'fa-headphones', 6),
  (7, 'EarPods & AirPods', 'إيربودز', 'earpods', 'fa-earlybirds', 7),
  (8, 'Montres Connectées', 'ساعات ذكية', 'smartwatches', 'fa-clock', 8),
  (9, 'Ring Lights', 'إضاءة', 'ring-lights', 'fa-lightbulb', 9),
  (10, 'Accessoires Gaming', 'إكسسوارات ألعاب', 'gaming', 'fa-gamepad', 10),
  (11, 'Accessoires PC', 'إكسسوارات كمبيوتر', 'computer-accessories', 'fa-laptop', 11);

-- Products: Chargers
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Chargeur Rapide USB-C 20W', 'شاحن سريع USB-C 20W', 'Chargeur rapide compatible iPhone et Samsung, charge complète en 30 min', 35.00, 45.00, 1, '/static/img/charger-usbc.svg', 1, 1, 50),
  ('Chargeur Sans Fil Qi 15W', 'شاحن لاسلكي 15W', 'Station de charge sans fil compatible tous smartphones Qi', 55.00, 70.00, 1, '/static/img/charger-wireless.svg', 1, 1, 30),
  ('Chargeur Voiture Double USB', 'شاحن سيارة مزدوج', 'Chargeur allume-cigare 2 ports USB 3.1A', 20.00, 28.00, 1, '/static/img/charger-car.svg', 1, 0, 45),
  ('Chargeur Magsafe iPhone', 'شاحن ماجسيف', 'Chargeur magnétique compatible iPhone 12/13/14/15', 65.00, 80.00, 1, '/static/img/charger-magsafe.svg', 1, 1, 25);

-- Products: Cables
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Câble USB-C vers Lightning 1m', 'كابل USB-C إلى لايتنينغ', 'Câble certifié charge rapide pour iPhone', 15.00, 22.00, 2, '/static/img/cable-lightning.svg', 1, 1, 100),
  ('Câble USB-C vers USB-C 2m', 'كابل USB-C إلى USB-C', 'Câble tressé haute qualité charge rapide 60W', 18.00, 25.00, 2, '/static/img/cable-usbc.svg', 1, 0, 80),
  ('Câble Micro USB Renforcé', 'كابل مايكرو USB', 'Câble micro USB tressé en nylon résistant', 10.00, 15.00, 2, '/static/img/cable-micro.svg', 1, 0, 120),
  ('Câble HDMI 4K 2m', 'كابل HDMI 4K', 'Câble HDMI haute vitesse 4K 60Hz', 25.00, 35.00, 2, '/static/img/cable-hdmi.svg', 1, 0, 40);

-- Products: Adapters
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Adaptateur USB-C vers Jack 3.5mm', 'محول USB-C إلى جاك', 'Adaptateur audio haute qualité DAC intégré', 12.00, 18.00, 3, '/static/img/adapter-jack.svg', 1, 0, 60),
  ('Hub USB-C 6-en-1', 'موزع USB-C 6 في 1', 'Hub multiport HDMI + USB 3.0 + SD + USB-C PD', 75.00, 95.00, 3, '/static/img/adapter-hub.svg', 1, 1, 20),
  ('Adaptateur OTG USB-C', 'محول OTG', 'Connectez clés USB et accessoires à votre smartphone', 8.00, 12.00, 3, '/static/img/adapter-otg.svg', 1, 0, 90);

-- Products: Cases
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Coque iPhone 15 Pro Transparente', 'غطاء آيفون 15 برو شفاف', 'Coque antichoc transparente ultra-fine', 25.00, 35.00, 4, '/static/img/case-iphone.svg', 1, 1, 70),
  ('Coque Samsung S24 Ultra Armor', 'غطاء سامسونغ S24 مدرع', 'Protection militaire double couche avec béquille', 30.00, 42.00, 4, '/static/img/case-samsung.svg', 1, 1, 50),
  ('Étui Portefeuille Universel', 'حافظة محفظة', 'Étui en cuir PU avec emplacements cartes', 22.00, 30.00, 4, '/static/img/case-wallet.svg', 1, 0, 40);

-- Products: Screen Protection
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Verre Trempé iPhone 15 9H', 'زجاج حماية آيفون 15', 'Protection écran 9H anti-rayures bord incurvé', 15.00, 22.00, 5, '/static/img/screen-iphone.svg', 1, 1, 150),
  ('Verre Trempé Samsung S24', 'زجاج حماية سامسونغ S24', 'Film protection écran qualité premium', 15.00, 20.00, 5, '/static/img/screen-samsung.svg', 1, 0, 130),
  ('Film Hydrogel Universel', 'فيلم هيدروجيل', 'Protection souple auto-cicatrisante toutes tailles', 12.00, 18.00, 5, '/static/img/screen-hydrogel.svg', 1, 0, 200);

-- Products: Headphones
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Casque Bluetooth ANC Pro', 'سماعة بلوتوث ANC', 'Casque sans fil avec réduction de bruit active', 120.00, 160.00, 6, '/static/img/headphone-anc.svg', 1, 1, 20),
  ('Écouteurs Filaires HiFi', 'سماعات سلكية HiFi', 'Écouteurs intra-auriculaires haute fidélité', 25.00, 35.00, 6, '/static/img/headphone-wired.svg', 1, 0, 60),
  ('Casque Gaming RGB', 'سماعة ألعاب RGB', 'Casque gaming avec micro et éclairage RGB', 85.00, 110.00, 6, '/static/img/headphone-gaming.svg', 1, 1, 25);

-- Products: EarPods
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('EarPods Pro Bluetooth 5.3', 'إيربودز برو بلوتوث', 'Écouteurs sans fil ANC, 30h autonomie avec boîtier', 95.00, 130.00, 7, '/static/img/earpods-pro.svg', 1, 1, 35),
  ('EarPods Sport Waterproof', 'إيربودز رياضية', 'Écouteurs sport IP67 résistants à l eau et la sueur', 60.00, 80.00, 7, '/static/img/earpods-sport.svg', 1, 0, 40),
  ('EarPods Mini Compacts', 'إيربودز ميني', 'Ultra-compacts, son cristallin, 20h autonomie', 45.00, 60.00, 7, '/static/img/earpods-mini.svg', 1, 0, 55);

-- Products: Smartwatches
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Montre Connectée Ultra Sport', 'ساعة ذكية رياضية', 'GPS, cardio, SpO2, 100+ modes sport, 14 jours batterie', 180.00, 250.00, 8, '/static/img/watch-ultra.svg', 1, 1, 15),
  ('Smartwatch Classic Élégante', 'ساعة ذكية كلاسيكية', 'Design élégant, notifications, santé, NFC', 130.00, 170.00, 8, '/static/img/watch-classic.svg', 1, 1, 20),
  ('Bracelet Connecté Fitness', 'سوار رياضي ذكي', 'Suivi activité, sommeil, notifications, étanche', 45.00, 60.00, 8, '/static/img/watch-band.svg', 1, 0, 60);

-- Products: Ring Lights
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Ring Light 26cm avec Trépied', 'رينغ لايت 26 سم', 'Anneau lumineux LED 3 modes, trépied extensible 160cm', 55.00, 75.00, 9, '/static/img/ringlight-26.svg', 1, 1, 25),
  ('Ring Light 10cm Portable', 'رينغ لايت صغير', 'Mini ring light clip pour smartphone, rechargeable USB', 18.00, 25.00, 9, '/static/img/ringlight-10.svg', 1, 0, 50),
  ('Selfie Ring Light avec Support', 'رينغ لايت سيلفي', 'Support téléphone + ring light réglable pour live/TikTok', 40.00, 55.00, 9, '/static/img/ringlight-selfie.svg', 1, 0, 30);

-- Products: Gaming
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Manette Gaming Bluetooth', 'يد تحكم بلوتوث', 'Manette sans fil compatible Android/iOS/PC', 65.00, 85.00, 10, '/static/img/gaming-controller.svg', 1, 1, 30),
  ('Support Ventilé Smartphone', 'حامل هاتف مبرد', 'Refroidisseur gaming avec ventilateur et grip', 35.00, 48.00, 10, '/static/img/gaming-cooler.svg', 1, 0, 35),
  ('Triggers Gaming Mobile L1R1', 'أزرار ألعاب موبايل', 'Gâchettes tactiles haute sensibilité PUBG/Free Fire', 12.00, 18.00, 10, '/static/img/gaming-triggers.svg', 1, 0, 80);

-- Products: Computer Accessories
INSERT OR IGNORE INTO products (name, name_ar, description, price, old_price, category_id, image_url, in_stock, featured, quantity) VALUES
  ('Souris Sans Fil Ergonomique', 'فأرة لاسلكية', 'Souris silencieuse 2.4GHz + Bluetooth, 3 DPI', 35.00, 48.00, 11, '/static/img/pc-mouse.svg', 1, 1, 40),
  ('Clavier Bluetooth Compact', 'لوحة مفاتيح بلوتوث', 'Clavier sans fil rechargeable multi-appareils', 55.00, 72.00, 11, '/static/img/pc-keyboard.svg', 1, 0, 25),
  ('Tapis de Souris XL Gaming', 'لوحة فأرة كبيرة', 'Tapis XXL 80x30cm, base antidérapante, éclairage RGB', 30.00, 40.00, 11, '/static/img/pc-mousepad.svg', 1, 0, 45),
  ('Support Laptop Réglable', 'حامل لابتوب', 'Support en aluminium ventilé réglable en hauteur', 45.00, 60.00, 11, '/static/img/pc-stand.svg', 1, 1, 20);
