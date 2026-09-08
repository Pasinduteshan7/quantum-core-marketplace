'use client';

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

const Computers = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const computers = [
   
     {
      id: 2,
      name: "Gaming Pro RTX 4080",
      brand: "Custom Build",
      price: "LKR 520,000",
      originalPrice: "LKR 580,000",
      specs: "Intel i9-13900K, 32GB DDR5, RTX 4080",
       image: "/images/images (11).jpg",
      discount: "10% OFF",
      itemCode: "G4080",
      category: "Gaming"
    },
    {
      id: 3,
      name: "Gaming Elite RTX 4070 Ti",
      brand: "Custom Build",
      price: "LKR 420,000",
      originalPrice: "LKR 465,000",
      specs: "Intel i7-13700K, 32GB DDR5, RTX 4070 Ti",
      image: "/images/imagesl.jpg",
      discount: "10% OFF",
      itemCode: "G4070",
      category: "Gaming"
    },
    {
      id: 4,
      name: "Gaming Master RTX 4070",
      brand: "Custom Build",
      price: "LKR 320,000",
      originalPrice: "LKR 350,000",
      specs: "Intel i7-13700K, 32GB RAM, RTX 4070",
       image: "/images/images (11).jpg",
      discount: "9% OFF",
      itemCode: "G4070S",
      category: "Gaming"
    },
    {
      id: 5,
      name: "Gaming Starter RTX 4060",
      brand: "Custom Build",
      price: "LKR 245,000",
      originalPrice: "LKR 275,000",
      specs: "AMD Ryzen 7 5700X, 16GB RAM, RTX 4060",
       image: "/images/images (11).jpg",
      discount: "11% OFF",
      itemCode: "G4060",
      category: "Gaming"
    },
    
    {
      id: 6,
      name: "AMD Gaming Beast RX 7900 XTX",
      brand: "Custom Build",
      price: "LKR 485,000",
      originalPrice: "LKR 540,000",
      specs: "AMD Ryzen 9 7900X, 32GB DDR5, RX 7900 XTX",
      image: "/images/imagesl.jpg",
      discount: "10% OFF",
      itemCode: "A7900",
      category: "Gaming"
    },
    {
      id: 7,
      name: "AMD Gaming Pro RX 7800 XT",
      brand: "Custom Build",
      price: "LKR 365,000",
      originalPrice: "LKR 405,000",
      specs: "AMD Ryzen 7 7700X, 32GB DDR5, RX 7800 XT",
      image: "/images/imagesl.jpg",
      discount: "10% OFF",
      itemCode: "A7800",
      category: "Gaming"
    },
    
    {
      id: 8,
      name: "Workstation Pro Max",
      brand: "HP Z4 G4",
      price: "LKR 450,000",
      originalPrice: "LKR 485,000",
      specs: "Intel Xeon W-2225, 64GB RAM, Quadro RTX",
      image: "/images/s-l400.jpg",
      
      discount: "7% OFF",
      itemCode: "W2225",
      category: "Workstation"
    },
    {
      id: 9,
      name: "Creator Workstation",
      brand: "Custom Build",
      price: "LKR 380,000",
      originalPrice: "LKR 420,000",
      specs: "AMD Ryzen 9 7900X, 64GB RAM, RTX 4070",
       image: "/images/s-l400.jpg",
      discount: "10% OFF",
      itemCode: "W7900",
      category: "Workstation"
    },
    {
      id: 10,
      name: "Professional Workstation",
      brand: "HP Z2 G9",
      price: "LKR 365,000",
      originalPrice: "LKR 400,000",
      specs: "Intel i7-12700, 32GB RAM, Quadro T1000",
       image: "/images/download5.jpg",
      discount: "9% OFF",
      itemCode: "W1270",
      category: "Workstation"
    },
   
    {
      id: 11,
      name: "Office Desktop Pro",
      brand: "Dell OptiPlex",
      price: "LKR 125,000",
      originalPrice: "LKR 140,000",
      specs: "Intel i5-12400, 16GB RAM, 512GB SSD",
       image: "/images/images (20).jpg",
      discount: "11% OFF",
      itemCode: "B1240",
      category: "Business"
    },
    {
      id: 12,
      name: "Business Desktop Elite",
      brand: "HP EliteDesk",
      price: "LKR 155,000",
      originalPrice: "LKR 175,000",
      specs: "Intel i5-12500, 16GB RAM, 512GB SSD",
        image: "/images/images (19).jpg",
      discount: "11% OFF",
      itemCode: "B1250",
      category: "Business"
    },
    {
      id: 13,
      name: "Server Desktop",
      brand: "Dell PowerEdge",
      price: "LKR 285,000",
      originalPrice: "LKR 320,000",
      specs: "Intel Xeon E-2236, 32GB ECC, 1TB SSD",
        image: "/images/images (19).jpg",
      discount: "11% OFF",
      itemCode: "S2236",
      category: "Server"
    },
   
  ];

  const accessories = [
    {
      id: 101,
      name: "Logitech G Pro X",
      brand: "Logitech",
      price: "LKR 28,000",
      originalPrice: "LKR 30,000",
      discount: "SAVE 7%",
      category: "Audio",
      image: "/images/download (15).jpg",
      specs: "Wireless Gaming Headset",
      itemCode: "ACC101"
    },
    {
      id: 102,
      name: "4K Gaming Monitor 32\"",
      brand: "LG UltraGear",
      price: "LKR 125,000",
      originalPrice: "LKR 140,000",
      specs: "32\" 4K UHD, 144Hz, HDR10",
       image: "/images/s-l400.jpg",
      discount: "11% OFF",
      itemCode: "M3214",
      category: "Monitors"
    },
    {
      id: 103,
      name: "Ultrawide Gaming Monitor",
      brand: "Samsung Odyssey",
      price: "LKR 165,000",
      originalPrice: "LKR 185,000",
      specs: "34\" Ultrawide, 165Hz, Curved",
      image: "/images/s-l400.jpg",
      discount: "11% OFF",
      itemCode: "M3416",
      category: "Monitors"
    },
    
    {
      id: 104,
      name: "Mechanical Gaming Keyboard",
      brand: "Razer BlackWidow",
      price: "LKR 18,500",
      originalPrice: "LKR 21,000",
      specs: "RGB, Cherry MX Blue, Wired",
      image: "/images/images (7).jpg",
      discount: "12% OFF",
      itemCode: "K1850",
      category: "Keyboards"
    },
    {
      id: 105,
      name: "Wireless Gaming Keyboard",
      brand: "Logitech G915",
      price: "LKR 32,000",
      originalPrice: "LKR 36,000",
      specs: "Low-profile, RGB, Wireless",
        image: "/images/images (7).jpg",
      discount: "11% OFF",
      itemCode: "K3200",
      category: "Keyboards"
    },
   
    {
      id: 106,
      name: "Gaming Mouse Pro",
      brand: "Razer DeathAdder",
      price: "LKR 12,500",
      originalPrice: "LKR 14,000",
      specs: "20000 DPI, RGB, Ergonomic",
     image: "/images/images (8).jpg",
      discount: "11% OFF",
      itemCode: "MS125",
      category: "Mice"
    },
    {
      id: 107,
      name: "Wireless Gaming Mouse",
      brand: "Logitech G Pro X",
      price: "LKR 18,000",
      originalPrice: "LKR 20,000",
      specs: "25600 DPI, Wireless, 70hr Battery",
      image: "/images/images (8).jpg",
      discount: "10% OFF",
      itemCode: "MS180",
      category: "Mice"
    },
    
    {
      id: 108,
      name: "Gaming Headset Pro",
      brand: "SteelSeries Arctis",
      price: "LKR 15,000",
      originalPrice: "LKR 17,000",
      specs: "7.1 Surround, RGB, Retractable Mic",
        image: "/images/download (15).jpg",
      discount: "12% OFF",
      itemCode: "H1500",
      category: "Audio"
    },
    {
      id: 109,
      name: "Wireless Gaming Headset",
      brand: "Corsair Virtuoso",
      price: "LKR 25,000",
      originalPrice: "LKR 28,000",
      specs: "Hi-Fi Audio, RGB, 20hr Battery",
      image: "/images/download (15).jpg",
      discount: "11% OFF",
      itemCode: "H2500",
      category: "Audio"
    },
  
    {
      id: 110,
      name: "DDR5 32GB RAM Kit",
      brand: "Corsair Vengeance",
      price: "LKR 45,000",
      originalPrice: "LKR 50,000",
      specs: "5600MHz, RGB, Dual Channel",
      image: "/images/download5.jpg",
      discount: "10% OFF",
      itemCode: "R3256",
      category: "Components"
    },
    {
      id: 111,
      name: "NVMe SSD 2TB",
      brand: "Samsung 980 Pro",
      price: "LKR 65,000",
      originalPrice: "LKR 72,000",
      specs: "PCIe 4.0, 7000 MB/s Read",
       image: "/images/images (12).jpg",
      discount: "10% OFF",
      itemCode: "S2000",
      category: "Components"
    },
    {
      id: 112,
      name: "Power Supply 850W",
      brand: "Corsair RM850x",
      price: "LKR 28,000",
      originalPrice: "LKR 32,000",
      specs: "80+ Gold, Modular, 10yr Warranty",
        image: "/images/images (14).jpg",
      discount: "13% OFF",
      itemCode: "P8500",
      category: "Components"
    },
   
  ];

  const allProducts = [...computers, ...accessories];

  const categories = [
    "All", "Gaming", "Workstation", "Business",
    "All-in-One", "Mini PC", "Budget", "Server",
    "Monitors", "Keyboards", "Mice", "Audio",
    "Components", "Streaming"
  ];

  const filteredProducts = selectedCategory === "All"
    ? allProducts
    : allProducts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="laptops-page">
      <div className="container">
        <h1 className="page-title">COMPUTERS AND ACCESSORIES</h1>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.discount && (
                <div className="badge discount">{product.discount}</div>
              )}
              <div className="badge category">{product.category}</div>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <div className="brand">{product.brand}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="specs">{product.specs}</p>
                {product.originalPrice && (
                  <p className="original-price">{product.originalPrice}</p>
                )}
                <p className="price">{product.price}</p>
                <p className="item-code">
                  <strong>Item Code:</strong> {product.itemCode}
                </p>
              </div>
              <button
                className="Addtocart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="contact-section">
          <p>Need a custom build? We can create the perfect PC for your needs!</p>
          <button className="contact-btn">Request Custom Build</button>
        </div>
      </div>
    </div>
  );
};

export default Computers;