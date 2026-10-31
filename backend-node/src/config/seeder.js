const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🌱 AUTOMATIC DATA SEEDER
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Baseline Synchronization
 * 
 * Replicates Spring Boot's CommandLineRunner DataSeeder:
 * 1. Seeds default Admin ('admin@quantumcore.com') and Customer ('customer@quantumcore.com')
 * 2. Seeds initial inventory from products.json into MongoDB
 */

const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@quantumcore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@quantumcore.com',
        password: 'admin123',
        role: 'ROLE_ADMIN'
      });
      console.log('\x1b[32m✔ Seeded default admin: admin@quantumcore.com\x1b[0m');
    }

    // 2. Seed Customer User
    const customerExists = await User.findOne({ email: 'customer@quantumcore.com' });
    if (!customerExists) {
      await User.create({
        name: 'Demo Customer',
        email: 'customer@quantumcore.com',
        password: 'customer123',
        role: 'ROLE_CUSTOMER'
      });
      console.log('\x1b[32m✔ Seeded default customer: customer@quantumcore.com\x1b[0m');
    }

    // 3. Seed Products from products.json
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      // Find products.json path
      const jsonPaths = [
        path.join(__dirname, '../data/products.json'),
        path.join(__dirname, '../../../backend-springboot/src/main/resources/products.json')
      ];

      let rawData = null;
      for (const p of jsonPaths) {
        if (fs.existsSync(p)) {
          rawData = fs.readFileSync(p, 'utf-8');
          break;
        }
      }

      if (rawData) {
        const productsData = JSON.parse(rawData);
        const formattedProducts = productsData.map(p => {
          const img = p.image || p.imageUrl || '/images/images.jpg';
          return {
            name: p.name,
            itemCode: p.itemCode,
            brand: p.brand || 'Quantum',
            category: p.category || 'Laptops',
            subCategory: p.subCategory || '',
            price: Number(p.price || 0),
            originalPrice: Number(p.originalPrice || p.price || 0),
            discount: p.discount || '',
            stock: Number(p.stock || 10),
            rating: Number(p.rating || 4.5),
            reviewsCount: Number(p.reviewCount || p.reviewsCount || 0),
            isFeatured: Boolean(p.isFeatured || false),
            image: img,
            imageUrl: img,
            images: p.images || [img],
            description: p.description || p.specs || '',
            specs: typeof p.specs === 'object' ? p.specs : { details: String(p.specs || '') },
            badge: p.badge || ''
          };
        });

        await Product.insertMany(formattedProducts);
        console.log(`\x1b[32m✔ Seeded ${formattedProducts.length} hardware products into MongoDB!\x1b[0m`);
      }
    } else {
      console.log(`\x1b[36m✔ MongoDB inventory already populated (${productCount} products).\x1b[0m`);
    }
  } catch (error) {
    console.error('Data seeding warning:', error.message);
  }
};

module.exports = seedDatabase;
