const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('1. Logging in as admin...');
  const loginRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@quantumcore.com', password: 'admin123' })
  });
  
  if (!loginRes.ok) {
    throw new Error(`Login failed with status: ${loginRes.status}`);
  }
  
  const { token } = await loginRes.json();
  console.log('Admin authenticated successfully.');

  console.log('2. Fetching existing products...');
  const existingRes = await fetch('http://localhost:8080/api/products');
  const existingProducts = await existingRes.json();
  const existingCodes = new Set(existingProducts.map(p => p.itemCode));
  console.log(`Found ${existingProducts.length} existing products in PostgreSQL.`);

  const jsonPath = path.join(__dirname, 'backend-springboot', 'src', 'main', 'resources', 'products.json');
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${products.length} products from products.json.`);

  let added = 0;
  let skipped = 0;

  for (const product of products) {
    if (existingCodes.has(product.itemCode)) {
      skipped++;
      continue;
    }

    // Spring Boot expects product without id (or null id for auto-increment)
    const { id, ...productData } = product;
    const res = await fetch('http://localhost:8080/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (res.ok) {
      added++;
      existingCodes.add(product.itemCode);
    } else {
      const err = await res.text();
      console.error(`Failed to add ${product.itemCode} (${product.name}): ${err}`);
    }
  }

  console.log(`\nSeeding completed!`);
  console.log(`- Added: ${added}`);
  console.log(`- Skipped (already existed): ${skipped}`);

  const verifyRes = await fetch('http://localhost:8080/api/products');
  const allProds = await verifyRes.json();
  console.log(`- Total products in PostgreSQL database now: ${allProds.length}`);
}

seed().catch(console.error);
