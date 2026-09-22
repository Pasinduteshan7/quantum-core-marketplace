const fs = require('fs');
const path = require('path');

const laptopsPath = path.join(__dirname, 'frontend/src/app/laptops/page.tsx');
const computersPath = path.join(__dirname, 'frontend/src/app/computers/page.tsx');

function cleanPrice(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function extractArray(content, startRegex) {
  const startMatch = content.match(startRegex);
  if (!startMatch) return [];
  const startIndex = startMatch.index + startMatch[0].length;
  
  let depth = 1;
  let endIndex = -1;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) return [];
  const rawArray = content.substring(startIndex, endIndex);
  
  try {
    const fn = new Function(`return [${rawArray}];`);
    return fn();
  } catch (err) {
    console.error('Error evaluating array:', err.message);
    return [];
  }
}

const laptopsContent = fs.readFileSync(laptopsPath, 'utf8');
const computersContent = fs.readFileSync(computersPath, 'utf8');

const rawLaptops = extractArray(laptopsContent, /const\s+laptops\s*=\s*\[/);
const rawComputers = extractArray(computersContent, /const\s+computers\s*=\s*\[/);
const rawDesktopAccessories = extractArray(computersContent, /const\s+accessories\s*=\s*\[/);

console.log(`Extracted ${rawLaptops.length} laptops/accessories`);
console.log(`Extracted ${rawComputers.length} computers`);
console.log(`Extracted ${rawDesktopAccessories.length} desktop accessories`);

const seenItemCodes = new Set();
const finalProducts = [];

function processItem(item, defaultCategory) {
  let category = defaultCategory;
  let subCategory = item.category || 'General';

  const accessorySubCats = [
    'Bags', 'Power', 'Storage', 'Cooling', 'Stands', 'Memory', 
    'Monitors', 'Keyboards', 'Mice', 'Audio', 'Components', 'Streaming', 'Accessories'
  ];

  if (accessorySubCats.includes(subCategory)) {
    category = 'Accessories';
  } else if (defaultCategory === 'Laptops') {
    category = 'Laptops';
  } else {
    category = 'Computers';
  }

  let itemCode = item.itemCode ? String(item.itemCode).trim().toUpperCase() : `ITEM-${item.id}`;
  if (seenItemCodes.has(itemCode)) {
    itemCode = `${itemCode}-${item.id}`;
  }
  seenItemCodes.add(itemCode);

  return {
    itemCode,
    name: item.name || 'Unnamed Product',
    brand: item.brand || 'Generic',
    category,
    subCategory,
    price: cleanPrice(item.price),
    originalPrice: cleanPrice(item.originalPrice) || cleanPrice(item.price),
    discount: item.discount || null,
    specs: item.specs || item.description || '',
    image: item.image || '/images/images.jpg',
    description: item.specs || item.name,
    stock: item.stock || Math.floor(Math.random() * 15) + 5,
    badge: item.discount || 'FEATURED',
    rating: typeof item.rating === 'number' ? item.rating : 4.8,
    reviewCount: typeof item.reviewCount === 'number' ? item.reviewCount : Math.floor(Math.random() * 30) + 5
  };
}

rawLaptops.forEach(item => {
  finalProducts.push(processItem(item, 'Laptops'));
});

rawComputers.forEach(item => {
  finalProducts.push(processItem(item, 'Computers'));
});

rawDesktopAccessories.forEach(item => {
  finalProducts.push(processItem(item, 'Accessories'));
});

console.log(`Total processed products: ${finalProducts.length}`);

const targetPath = path.join(__dirname, 'backend-springboot/src/main/resources/products.json');
fs.writeFileSync(targetPath, JSON.stringify(finalProducts, null, 2), 'utf8');
console.log(`Wrote ${finalProducts.length} products to ${targetPath}`);
