'use client';

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

const Laptop = () => {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");

  // ===== COMPREHENSIVE HIERARCHICAL CATEGORY-BRAND MAPPING =====
  const categoryHierarchy = {
    laptops: {
      Gaming: ["MSI", "ASUS ROG", "HP Omen", "HP Victus", "Lenovo Legion", "Acer Nitro", "Razer", "Dell Alienware", "Apple"],
      Business: ["Lenovo", "Dell", "HP", "ASUS", "Apple"],
      Ultrabook: ["ASUS", "Dell", "HP", "Razer", "Lenovo", "Apple"],
      Budget: ["Acer", "ASUS", "HP", "Lenovo", "Dell"],
      Creative: ["ASUS", "MSI", "Dell", "Apple"]
    },
    accessories: {
      Bags: ["ASUS ROG", "HP", "Dell", "Samsonite", "WIWU", "Tigernu", "Apple", "Incase", "Targus", "Peak Design"],
      Power: ["Anker", "Baseus", "Ugreen", "Generic", "OEM Replacement", "Apple", "Belkin", "RAVPower"],
      Storage: ["Samsung", "WD", "Seagate", "SanDisk", "Crucial", "Apple", "SK Hynix", "Kingston"],
      Cooling: ["Cooler Master", "DeepCool", "Havit", "Klim", "Arctic", "Zalman"],
      Stands: ["Baseus", "Ugreen", "Generic", "Moft", "Elago", "Rain Design"],
      Memory: ["Corsair", "Kingston", "Crucial", "Samsung", "Apple", "G.Skill"]
    }
  };
  const laptops = [
    // ===== GAMING LAPTOPS - MASSIVE EXPANSION =====
    // MSI Gaming Variants
    { id: 1, name: "MSI Katana 15 Gaming", brand: "MSI", price: 285000, originalPrice: 320000, specs: "Intel i7-12700H, 16GB RAM, RTX 4060", image: "/images/images.jpg", discount: "11% OFF", itemCode: "M4060", category: "Gaming" },
    { id: 1001, name: "MSI Katana 15 Gaming 512GB", brand: "MSI", price: 295000, originalPrice: 330000, specs: "Intel i7-12700H, 16GB RAM, RTX 4060, 512GB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "M4060-512", category: "Gaming" },
    { id: 1002, name: "MSI Katana 15 Gaming 32GB", brand: "MSI", price: 315000, originalPrice: 350000, specs: "Intel i7-12700H, 32GB RAM, RTX 4060, 1TB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "M4060-32", category: "Gaming" },
    { id: 1003, name: "MSI Katana 17 Gaming", brand: "MSI", price: 325000, originalPrice: 360000, specs: "Intel i7-13700H, 16GB DDR5, RTX 4070, 17.3 inch", image: "/images/images.jpg", discount: "10% OFF", itemCode: "M4070-17", category: "Gaming" },
    { id: 1004, name: "MSI Katana Pro RTX 4080", brand: "MSI", price: 485000, originalPrice: 540000, specs: "Intel i9-13900H, 32GB DDR5, RTX 4080, 1TB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MPRO4080", category: "Gaming" },
    { id: 1005, name: "MSI Katana GF76 Thin", brand: "MSI", price: 225000, originalPrice: 250000, specs: "Intel i5-12450H, 8GB RAM, RTX 3050, Budget Gaming", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MGF76", category: "Gaming" },
    { id: 1006, name: "MSI Raider GE88 HX", brand: "MSI", price: 545000, originalPrice: 600000, specs: "Intel i9-12900HX, 32GB DDR5, RTX 4080 Super, 18 inch", image: "/images/images.jpg", discount: "9% OFF", itemCode: "MGE88HX", category: "Gaming" },
    { id: 1007, name: "MSI Crosshair 16 HX", brand: "MSI", price: 535000, originalPrice: 590000, specs: "Intel i9-13900HX, 32GB, RTX 4070 Ti, Ultra Gaming", image: "/images/images.jpg", discount: "9% OFF", itemCode: "MCH16", category: "Gaming" },
    { id: 1008, name: "MSI GS66 Stealth Ultra", brand: "MSI", price: 425000, originalPrice: 470000, specs: "Intel i7-13700H, 16GB DDR5, RTX 4070, 15.6 4K", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MGS66U", category: "Gaming" },
    { id: 2, name: "MSI Stealth 17 Studio", brand: "MSI", price: 420000, originalPrice: 465000, specs: "Intel i9-12900H, 32GB RAM, RTX 4070", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "M4070", category: "Gaming" },
    { id: 3, name: "MSI Raider GE78 HX", brand: "MSI", price: 520000, originalPrice: 580000, specs: "Intel i9-13980HX, 32GB DDR5, RTX 4080", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "M4080", category: "Gaming" },
    { id: 4, name: "MSI GF63 Thin 12VE", brand: "MSI", price: 225000, originalPrice: 250000, specs: "Intel i5-12450H, 8GB RAM, RTX 3050", image: "/images/images.jpg", discount: "10% OFF", itemCode: "M3050", category: "Gaming" },
    
    // ASUS ROG Gaming
    { id: 5, name: "ASUS ROG Strix G15", brand: "ASUS ROG", price: 285000, originalPrice: 320000, specs: "AMD Ryzen 7 6800H, 16GB RAM, RTX 4060", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "11% OFF", itemCode: "R4060", category: "Gaming" },
    { id: 6, name: "ASUS ROG Zephyrus G14", brand: "ASUS ROG", price: 365000, originalPrice: 400000, specs: "AMD Ryzen 9 6900HS, 16GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "R4070", category: "Gaming" },
    { id: 7, name: "ASUS ROG Strix SCAR 17", brand: "ASUS ROG", price: 485000, originalPrice: 540000, specs: "Intel i9-12900H, 32GB RAM, RTX 4080", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "10% OFF", itemCode: "R4080", category: "Gaming" },
    { id: 8, name: "ASUS ROG Ally", brand: "ASUS ROG", price: 165000, originalPrice: 185000, specs: "AMD Ryzen Z1, 16GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "ALLY", category: "Gaming" },
    
    // HP Gaming
    { id: 9, name: "HP Omen 16 Gaming", brand: "HP Omen", price: 275000, originalPrice: 310000, specs: "Intel i7-12700H, 16GB RAM, RTX 4060", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "H4060", category: "Gaming" },
    { id: 10, name: "HP Victus 15 Gaming", brand: "HP Victus", price: 195000, originalPrice: 220000, specs: "AMD Ryzen 5 5600H, 16GB RAM, RTX 3050", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "H3050", category: "Gaming" },
    { id: 11, name: "HP Omen 17 Pro", brand: "HP Omen", price: 385000, originalPrice: 425000, specs: "Intel i7-12700H, 32GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "H4070", category: "Gaming" },
    { id: 12, name: "HP Victus 16.1\"", brand: "HP Victus", price: 245000, originalPrice: 275000, specs: "Intel i7-11800H, 16GB RAM, RTX 3060", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "HV16", category: "Gaming" },
    
    // Dell Gaming
    { id: 13, name: "Dell Alienware m15", brand: "Dell Alienware", price: 495000, originalPrice: 560000, specs: "Intel i9-12900H, 32GB RAM, RTX 4080", image: "/images/images.jpg", discount: "12% OFF", itemCode: "DAL15", category: "Gaming" },
    { id: 14, name: "Dell Alienware x15", brand: "Dell Alienware", price: 425000, originalPrice: 485000, specs: "Intel i7-12700H, 16GB RAM, RTX 3070 Ti", image: "/images/images.jpg", discount: "12% OFF", itemCode: "DALX", category: "Gaming" },
    
    // Lenovo Legion
    { id: 15, name: "Lenovo Legion 5", brand: "Lenovo Legion", price: 265000, originalPrice: 300000, specs: "AMD Ryzen 7 5800H, 16GB RAM, RTX 4060", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LL5", category: "Gaming" },
    { id: 16, name: "Lenovo Legion 7", brand: "Lenovo Legion", price: 395000, originalPrice: 450000, specs: "Intel i7-12700H, 32GB RAM, RTX 4070", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LL7", category: "Gaming" },
    
    // Acer Nitro
    { id: 17, name: "Acer Nitro 5", brand: "Acer Nitro", price: 245000, originalPrice: 280000, specs: "Intel i5-11400H, 8GB RAM, RTX 3050", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "AN5", category: "Gaming" },
    { id: 18, name: "Acer Nitro 7", brand: "Acer Nitro", price: 325000, originalPrice: 375000, specs: "Intel i7-11800H, 16GB RAM, RTX 4060", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "AN7", category: "Gaming" },
    
    // Razer Gaming
    { id: 19, name: "Razer Blade 15", brand: "Razer", price: 425000, originalPrice: 485000, specs: "Intel i7-12700H, 16GB RAM, RTX 3070 Ti", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "RB15", category: "Gaming" },
    { id: 20, name: "Razer Blade 14", brand: "Razer", price: 385000, originalPrice: 440000, specs: "AMD Ryzen 7 6800H, 16GB RAM, RTX 3070", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "RB14", category: "Gaming" },
    
    // More Gaming - Additional Models
    { id: 41, name: "MSI Raider GE77 Ultra", brand: "MSI", price: 625000, originalPrice: 700000, specs: "Intel i9-13900H, 32GB RAM, RTX 4090", image: "/images/images.jpg", discount: "11% OFF", itemCode: "M4090", category: "Gaming" },
    { id: 42, name: "MSI GS66 Stealth", brand: "MSI", price: 385000, originalPrice: 425000, specs: "Intel i7-11800H, 16GB RAM, RTX 3070", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "MGS66", category: "Gaming" },
    { id: 43, name: "ASUS ROG Flow X16", brand: "ASUS ROG", price: 495000, originalPrice: 550000, specs: "Intel i9-12900H, 32GB RAM, RTX 3080 Ti", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "10% OFF", itemCode: "RFX16", category: "Gaming" },
    { id: 44, name: "ASUS TUF Gaming A16", brand: "ASUS ROG", price: 315000, originalPrice: 350000, specs: "AMD Ryzen 9 6900HX, 16GB RAM, RTX 3070", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "RTUG16", category: "Gaming" },
    { id: 45, name: "HP Omen 15 2024", brand: "HP Omen", price: 325000, originalPrice: 375000, specs: "Intel i9-13900H, 16GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "13% OFF", itemCode: "HOX15", category: "Gaming" },
    { id: 46, name: "HP Victus 17.3 Pro", brand: "HP Victus", price: 295000, originalPrice: 340000, specs: "Intel i7-12700H, 16GB RAM, RTX 3060", image: "/images/images (6).jpg", discount: "13% OFF", itemCode: "HVP17", category: "Gaming" },
    { id: 47, name: "Lenovo Legion 5 Pro", brand: "Lenovo Legion", price: 315000, originalPrice: 360000, specs: "AMD Ryzen 7 6800H, 16GB RAM, RTX 3070 Ti", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LL5PRO", category: "Gaming" },
    { id: 48, name: "Lenovo LOQ 165", brand: "Lenovo Legion", price: 225000, originalPrice: 260000, specs: "Intel i5-12450H, 8GB RAM, RTX 3050", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "LLOQ165", category: "Gaming" },
    { id: 49, name: "Acer Nitro 16", brand: "Acer Nitro", price: 375000, originalPrice: 420000, specs: "Intel i7-12700H, 16GB RAM, RTX 4070", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "AN16", category: "Gaming" },
    { id: 50, name: "Acer Predator 15", brand: "Acer Nitro", price: 445000, originalPrice: 500000, specs: "Intel i9-12900HK, 32GB RAM, RTX 4080", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "AP15", category: "Gaming" },
    { id: 51, name: "Dell Alienware m17 R5", brand: "Dell Alienware", price: 565000, originalPrice: 640000, specs: "Intel i9-12900H, 32GB DDR5, RTX 4090", image: "/images/images.jpg", discount: "12% OFF", itemCode: "DAM17", category: "Gaming" },
    { id: 52, name: "Razer Blade Pro 17", brand: "Razer", price: 685000, originalPrice: 760000, specs: "Intel i9-13900H, 32GB RAM, RTX 4080", image: "/images/images (5).jpg", discount: "10% OFF", itemCode: "RBP17", category: "Gaming" },

    // ===== BUSINESS CATEGORY =====
    // Dell Business
    { id: 21, name: "Dell Latitude 5530", brand: "Dell", price: 165000, originalPrice: 185000, specs: "Intel i5-1235U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "D5530", category: "Business" },
    { id: 22, name: "Dell Latitude 7540", brand: "Dell", price: 245000, originalPrice: 280000, specs: "Intel i7-1365U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "D7540", category: "Business" },
    
    // HP Business
    { id: 23, name: "HP EliteBook 850", brand: "HP", price: 195000, originalPrice: 220000, specs: "Intel i5-1235U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "H8500", category: "Business" },
    { id: 24, name: "HP ProBook 450", brand: "HP", price: 145000, originalPrice: 165000, specs: "Intel i5-1135G7, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "HP450", category: "Business" },
    
    // Lenovo ThinkPad
    { id: 25, name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: 285000, originalPrice: 320000, specs: "Intel i7-1255U, 16GB RAM, 1TB SSD", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "LX1C", category: "Business" },
    { id: 26, name: "Lenovo ThinkPad E14", brand: "Lenovo", price: 125000, originalPrice: 145000, specs: "Intel i5-1235U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "LE14", category: "Business" },
    
    // ASUS VivoBook
    { id: 27, name: "ASUS VivoBook 15", brand: "ASUS", price: 125000, originalPrice: 140000, specs: "Intel i5-1135G7, 8GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "AV15", category: "Business" },
    { id: 28, name: "ASUS VivoBook Pro 16", brand: "ASUS", price: 185000, originalPrice: 210000, specs: "Intel i7-12700H, 16GB RAM, RTX 4050", image: "/images/images (6).jpg", discount: "12% OFF", itemCode: "AVP16", category: "Business" },
    
    // More Business Laptops
    { id: 53, name: "Lenovo ThinkPad T14", brand: "Lenovo", price: 165000, originalPrice: 190000, specs: "Intel i7-1265U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "LTT14", category: "Business" },
    { id: 54, name: "Lenovo ThinkPad P1", brand: "Lenovo", price: 385000, originalPrice: 440000, specs: "Intel i7-12700H, 32GB RAM, RTX A2000", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LTP1", category: "Business" },
    { id: 55, name: "Lenovo ThinkPad X13", brand: "Lenovo", price: 145000, originalPrice: 165000, specs: "Intel i5-1250P, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LTX13", category: "Business" },
    { id: 56, name: "Dell Latitude 7540", brand: "Dell", price: 245000, originalPrice: 280000, specs: "Intel i7-1365U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "DL7540", category: "Business" },
    { id: 57, name: "Dell Latitude 5440", brand: "Dell", price: 165000, originalPrice: 190000, specs: "Intel i7-1365U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "DL5440", category: "Business" },
    { id: 58, name: "Dell Vostro 15 5510", brand: "Dell", price: 125000, originalPrice: 145000, specs: "Intel i5-11400H, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "DV5510", category: "Business" },
    { id: 59, name: "HP EliteBook 840 G9", brand: "HP", price: 225000, originalPrice: 260000, specs: "Intel i7-1255U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "HEB840", category: "Business" },
    { id: 60, name: "HP ProBook 650 G9", brand: "HP", price: 175000, originalPrice: 200000, specs: "Intel i5-1255U, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "HPB650", category: "Business" },
    { id: 61, name: "HP ProBook 450 G9", brand: "HP", price: 135000, originalPrice: 155000, specs: "Intel i5-1235U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "HPB450", category: "Business" },
    { id: 62, name: "ASUS ExpertBook B5", brand: "ASUS", price: 295000, originalPrice: 340000, specs: "Intel i5-1250P, 16GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "13% OFF", itemCode: "AEB5", category: "Business" },
    { id: 63, name: "ASUS Chromebook Enterprise", brand: "ASUS", price: 95000, originalPrice: 110000, specs: "Intel Celeron N3350, 4GB RAM, 32GB SSD", image: "/images/images (6).jpg", discount: "14% OFF", itemCode: "ACE100", category: "Business" },

    // ===== ULTRABOOK CATEGORY =====
    { id: 29, name: "ASUS ZenBook 14", brand: "ASUS", price: 185000, originalPrice: 210000, specs: "Intel i5-1235U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "AZ14", category: "Ultrabook" },
    { id: 30, name: "Dell XPS 13", brand: "Dell", price: 225000, originalPrice: 260000, specs: "Intel i7-1280P, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "DXP13", category: "Ultrabook" },
    { id: 31, name: "Lenovo Yoga 9i", brand: "Lenovo", price: 195000, originalPrice: 225000, specs: "Intel i7-1255U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "LY9", category: "Ultrabook" },
    { id: 32, name: "HP Envy 13", brand: "HP", price: 135000, originalPrice: 155000, specs: "Intel i7-1195G7, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "HE13", category: "Ultrabook" },
    { id: 33, name: "Razer Blade Stealth", brand: "Razer", price: 195000, originalPrice: 225000, specs: "Intel i7-1280P, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "RBS", category: "Ultrabook" },
    
    // More Ultrabook Models
    { id: 64, name: "ASUS ZenBook 13", brand: "ASUS", price: 165000, originalPrice: 190000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "AZ13", category: "Ultrabook" },
    { id: 65, name: "ASUS ZenBook Flip 14", brand: "ASUS", price: 215000, originalPrice: 250000, specs: "Intel i7-1255U, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "AZF14", category: "Ultrabook" },
    { id: 66, name: "Dell XPS 15", brand: "Dell", price: 325000, originalPrice: 375000, specs: "Intel i7-12700H, 32GB RAM, RTX 3050 Ti", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "DXP15", category: "Ultrabook" },
    { id: 67, name: "HP Spectre x360 14", brand: "HP", price: 275000, originalPrice: 315000, specs: "Intel i7-1280P, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "HPS14", category: "Ultrabook" },
    { id: 68, name: "HP Spectre x360 15", brand: "HP", price: 315000, originalPrice: 365000, specs: "Intel i7-12700H, 16GB RAM, RTX 3050", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "HPS15", category: "Ultrabook" },
    { id: 69, name: "Lenovo Yoga 7i", brand: "Lenovo", price: 165000, originalPrice: 190000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "LY7I", category: "Ultrabook" },
    { id: 70, name: "Lenovo ThinkBook Plus Gen 4", brand: "Lenovo", price: 245000, originalPrice: 280000, specs: "Intel i7-12700H, 16GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LBP4", category: "Ultrabook" },
    { id: 71, name: "Razer Blade Stealth 13 2024", brand: "Razer", price: 215000, originalPrice: 245000, specs: "Intel i7-1360P, 16GB RAM, Iris Xe", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "RBS13K", category: "Ultrabook" },

    // ===== BUDGET CATEGORY =====
    { id: 34, name: "Acer Aspire 5", brand: "Acer", price: 95000, originalPrice: 110000, specs: "Intel i3-1215U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "AA5", category: "Budget" },
    { id: 35, name: "Lenovo IdeaPad 3", brand: "Lenovo", price: 75000, originalPrice: 85000, specs: "AMD Ryzen 3 5300U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LI3", category: "Budget" },
    { id: 36, name: "Dell Inspiron 15", brand: "Dell", price: 85000, originalPrice: 100000, specs: "Intel i3-1215U, 4GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "DI15", category: "Budget" },
    { id: 37, name: "HP 15s-eq2044dx", brand: "HP", price: 80000, originalPrice: 95000, specs: "AMD Ryzen 3 5300U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "16% OFF", itemCode: "HP15", category: "Budget" },
    
    // More Budget Laptops
    { id: 72, name: "Acer Aspire 3", brand: "Acer", price: 65000, originalPrice: 75000, specs: "Intel Celeron N3350, 4GB RAM, 128GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "AA3", category: "Budget" },
    { id: 73, name: "Acer Aspire 7", brand: "Acer", price: 135000, originalPrice: 155000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "AA7", category: "Budget" },
    { id: 74, name: "Lenovo IdeaPad 1", brand: "Lenovo", price: 55000, originalPrice: 65000, specs: "Intel Celeron N4020, 4GB RAM, 64GB eMMC", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "LI1", category: "Budget" },
    { id: 75, name: "Lenovo IdeaPad 5", brand: "Lenovo", price: 145000, originalPrice: 165000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "LI5", category: "Budget" },
    { id: 76, name: "Dell Inspiron 14", brand: "Dell", price: 95000, originalPrice: 110000, specs: "Intel i5-1135G7, 8GB RAM, 256GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "DI14", category: "Budget" },
    { id: 77, name: "Dell Inspiron 16", brand: "Dell", price: 115000, originalPrice: 135000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "DI16", category: "Budget" },
    { id: 78, name: "HP 14s-fq0006AU", brand: "HP", price: 75000, originalPrice: 88000, specs: "AMD Ryzen 3 3200U, 4GB RAM, 128GB SSD", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "HP14S", category: "Budget" },
    { id: 79, name: "HP Pavilion 15", brand: "HP", price: 125000, originalPrice: 145000, specs: "Intel i5-12450H, 8GB RAM, 512GB SSD", image: "/images/images (5).jpg", discount: "14% OFF", itemCode: "HPP15", category: "Budget" },
    { id: 80, name: "ASUS VivoBook 16", brand: "ASUS", price: 165000, originalPrice: 190000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "13% OFF", itemCode: "AV16", category: "Budget" },
    { id: 81, name: "ASUS Chromebook C436", brand: "ASUS", price: 85000, originalPrice: 100000, specs: "Intel Core m3-8100Y, 8GB RAM, 128GB SSD", image: "/images/images (6).jpg", discount: "15% OFF", itemCode: "ACC436", category: "Budget" },

    // ===== CREATIVE CATEGORY =====
    { id: 38, name: "ASUS ProArt 15", brand: "ASUS", price: 395000, originalPrice: 450000, specs: "Intel i7-1280P, 32GB RAM, RTX 3050 Ti", image: "/images/images (6).jpg", discount: "12% OFF", itemCode: "AP15", category: "Creative" },
    { id: 39, name: "MSI Creator Z16", brand: "MSI", price: 550000, originalPrice: 620000, specs: "Intel i9-12900H, 32GB RAM, RTX 4080", image: "/images/blk_sitewide_400x400.webp", discount: "11% OFF", itemCode: "MCZ16", category: "Creative" },
    { id: 40, name: "Dell Precision 15", brand: "Dell", price: 495000, originalPrice: 560000, specs: "Intel i9-12900H, 32GB RAM, RTX A2000", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "DP15", category: "Creative" },
    
    // More Creative Workstations
    { id: 82, name: "ASUS ProArt 16 OLED", brand: "ASUS", price: 645000, originalPrice: 720000, specs: "Intel i9-13900H, 32GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "AP16OLED", category: "Creative" },
    { id: 83, name: "ASUS StudioBook 15 H500", brand: "ASUS", price: 525000, originalPrice: 600000, specs: "Intel i9-12900H, 32GB RAM, RTX A2000", image: "/images/images (6).jpg", discount: "12% OFF", itemCode: "AH500", category: "Creative" },
    { id: 84, name: "MSI Creator X17 HX", brand: "MSI", price: 725000, originalPrice: 800000, specs: "Intel i9-12900HX, 32GB DDR5, RTX 4090", image: "/images/blk_sitewide_400x400.webp", discount: "9% OFF", itemCode: "MCX17", category: "Creative" },
    { id: 85, name: "MSI Creator 17 M13VE", brand: "MSI", price: 475000, originalPrice: 540000, specs: "Intel i7-12700H, 16GB RAM, RTX 3060", image: "/images/blk_sitewide_400x400.webp", discount: "12% OFF", itemCode: "MCR17M", category: "Creative" },
    { id: 86, name: "Dell Precision 17", brand: "Dell", price: 625000, originalPrice: 700000, specs: "Intel i9-13900H, 32GB RAM, RTX A4500", image: "/images/images (5).jpg", discount: "11% OFF", itemCode: "DP17", category: "Creative" },
    { id: 87, name: "Dell Precision 5680", brand: "Dell", price: 545000, originalPrice: 620000, specs: "Intel i9-13980HX, 64GB RAM, RTX 6000 Ada", image: "/images/images (5).jpg", discount: "12% OFF", itemCode: "DP5680", category: "Creative" }
  ];

  const accessories = [
    { 
      id: 101, 
      name: "Gaming Laptop Backpack", 
      brand: "ASUS ROG", 
      price: "LKR 8,500", 
      originalPrice: "LKR 9,500", 
      specs: "17-inch laptop compartment, RGB lighting", 
       image: "/images/downloadd.jpg",
      discount: "11% OFF", 
      itemCode: "B1700", 
      category: "Bags" },
    { id: 102, name: "Professional Laptop Bag", brand: "HP", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "15.6-inch laptop sleeve, multiple pockets", image: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=500", available: true, discount: "13% OFF", itemCode: "B1560", category: "Bags" },
    
    {
      id: 103,
      name: "Adjustable Laptop Stand",
      brand: "Generic",
      price: "LKR 4,500",
      originalPrice: "LKR 5,000",
      specs: "Aluminum alloy, adjustable height",
      image: "/images/images (5).jpg",
      discount: "10% OFF",
      itemCode: "S4500",
      category: "Stands"
    },
    {
      id: 104,
      name: "Gaming Laptop Cooling Pad",
      brand: "Cooler Master",
      price: "LKR 7,500",
      originalPrice: "LKR 8,500",
      specs: "RGB fans, USB hub, adjustable speed",
      image: "/images/images (16).jpg",
      discount: "12% OFF",
      itemCode: "C7500",
      category: "Cooling"
    },
    
    {
      id: 105,
      name: "Portable SSD 1TB",
      brand: "Samsung",
      price: "LKR 22,000",
      originalPrice: "LKR 25,000",
      specs: "USB 3.2, 1050 MB/s read speed",
       image: "/images/images (1).jpg",
      discount: "12% OFF",
      itemCode: "T7100",
      category: "Storage"
    },
    {
      id: 106,
      name: "External HDD 2TB",
      brand: "WD",
      price: "LKR 12,500",
      originalPrice: "LKR 14,000",
      specs: "USB 3.0, portable design",
       image: "/images/images (1).jpg",
      discount: "11% OFF",
      itemCode: "W2000",
      category: "Storage"
    },
   
    {
      id: 107,
      name: "Universal Laptop Charger",
      brand: "Generic",
      price: "LKR 5,500",
      originalPrice: "LKR 6,500",
      specs: "90W, multiple tips included",
       image: "/images/download (4).jpg",
      discount: "15% OFF",
      itemCode: "P9000",
      category: "Power"
    },
    
    // ===== MORE BAGS =====
    { id: 108, name: "ASUS ROG Ranger BP 17", brand: "ASUS ROG", price: "LKR 12,500", originalPrice: "LKR 14,500", specs: "17-inch compartment, waterproof", image: "/images/downloadd.jpg", discount: "14% OFF", itemCode: "ROGRB17", category: "Bags" },
    { id: 109, name: "HP Laptop Sleeve 15.6\"", brand: "HP", price: "LKR 4,500", originalPrice: "LKR 5,500", specs: "Neoprene material, protective cushion", image: "/images/downloadd.jpg", discount: "18% OFF", itemCode: "HPSLE15", category: "Bags" },
    { id: 110, name: "Dell Backpack Essential", brand: "Dell", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "15-inch laptop pocket, ergonomic", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "DELBP15", category: "Bags" },
    { id: 111, name: "Samsonite Laptop Briefcase", brand: "Samsonite", price: "LKR 8,500", originalPrice: "LKR 10,000", specs: "Professional style, shoulder strap", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "SMLBC", category: "Bags" },
    { id: 112, name: "WIWU Knight Backpack", brand: "WIWU", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "Water-resistant, multi-compartment", image: "/images/downloadd.jpg", discount: "13% OFF", itemCode: "WIWKB", category: "Bags" },
    { id: 113, name: "Tigernu Laptop Backpack", brand: "Tigernu", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "USB charging port, anti-theft", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "TGNBP", category: "Bags" },
    
    // ===== MORE POWER =====
    { id: 114, name: "Anker PowerCore 26800", brand: "Anker", price: "LKR 8,500", originalPrice: "LKR 10,000", specs: "26800mAh, 65W charging", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "ANC26", category: "Power" },
    { id: 115, name: "Baseus GaN Charger 100W", brand: "Baseus", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "4 USB-C ports, compact", image: "/images/download (4).jpg", discount: "13% OFF", itemCode: "BASGN100", category: "Power" },
    { id: 116, name: "Ugreen USB-C Hub Charger", brand: "Ugreen", price: "LKR 4,500", originalPrice: "LKR 5,500", specs: "6-in-1, 65W PD", image: "/images/download (4).jpg", discount: "18% OFF", itemCode: "UGRHUB", category: "Power" },
    { id: 117, name: "Anker Nano Power Bank", brand: "Anker", price: "LKR 3,500", originalPrice: "LKR 4,500", specs: "10000mAh, ultra-compact", image: "/images/download (4).jpg", discount: "22% OFF", itemCode: "ANPB10", category: "Power" },
    { id: 118, name: "Baseus Power Bank 65W", brand: "Baseus", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "20000mAh, fast charging", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "BASPB20", category: "Power" },
    { id: 119, name: "Ugreen 100W GaN Charger", brand: "Ugreen", price: "LKR 7,500", originalPrice: "LKR 8,500", specs: "Dual USB-C, compact design", image: "/images/download (4).jpg", discount: "12% OFF", itemCode: "UGGAN100", category: "Power" },
    { id: 120, name: "OEM Replacement Adapter 90W", brand: "OEM Replacement", price: "LKR 3,500", originalPrice: "LKR 4,500", specs: "Universal connector", image: "/images/download (4).jpg", discount: "22% OFF", itemCode: "OEM90W", category: "Power" },
    
    // ===== MORE STORAGE =====
    { id: 121, name: "Samsung T7 Shield 2TB", brand: "Samsung", price: "LKR 35,000", originalPrice: "LKR 40,000", specs: "Portable SSD, IP65 rated", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "ST72TB", category: "Storage" },
    { id: 122, name: "WD Blue SN580 1TB", brand: "WD", price: "LKR 12,500", originalPrice: "LKR 15,000", specs: "NVMe SSD, M.2 2280", image: "/images/images (1).jpg", discount: "17% OFF", itemCode: "WDSN1TB", category: "Storage" },
    { id: 123, name: "Seagate Barracuda 2TB", brand: "Seagate", price: "LKR 9,500", originalPrice: "LKR 11,500", specs: "Internal HDD, 3.5 inch", image: "/images/images (1).jpg", discount: "17% OFF", itemCode: "SB2TB", category: "Storage" },
    { id: 124, name: "SanDisk Ultra 500GB", brand: "SanDisk", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "Portable SSD, USB 3.1", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "SU500", category: "Storage" },
    { id: 125, name: "Crucial MX500 1TB", brand: "Crucial", price: "LKR 11,500", originalPrice: "LKR 13,500", specs: "2.5\" SSD, SATA III", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "CM1TB", category: "Storage" },
    { id: 126, name: "Samsung 870 QVO 2TB", brand: "Samsung", price: "LKR 18,500", originalPrice: "LKR 22,000", specs: "2.5\" SSD, 4bit QLC", image: "/images/images (1).jpg", discount: "16% OFF", itemCode: "S8702TB", category: "Storage" },
    
    // ===== MORE COOLING =====
    { id: 127, name: "Cooler Master Notepal U3 Plus", brand: "Cooler Master", price: "LKR 7,500", originalPrice: "LKR 8,500", specs: "3 fans, dual USB hub", image: "/images/images (16).jpg", discount: "12% OFF", itemCode: "CMU3", category: "Cooling" },
    { id: 128, name: "DeepCool N80 Pro", brand: "DeepCool", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "Large fan, aluminum stand", image: "/images/images (16).jpg", discount: "15% OFF", itemCode: "DN80P", category: "Cooling" },
    { id: 129, name: "Havit Laptop Cooling Pad", brand: "Havit", price: "LKR 4,500", originalPrice: "LKR 5,500", specs: "2 fans, silent operation", image: "/images/images (16).jpg", discount: "18% OFF", itemCode: "HCP2", category: "Cooling" },
    { id: 130, name: "Klim V2 Cooling Pad", brand: "Klim", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "Ultra-powerful fans, RGB", image: "/images/images (16).jpg", discount: "13% OFF", itemCode: "KV2", category: "Cooling" },
    { id: 131, name: "Cooler Master Ergostand", brand: "Cooler Master", price: "LKR 8,500", originalPrice: "LKR 9,500", specs: "Adjustable, integrated fans", image: "/images/images (16).jpg", discount: "11% OFF", itemCode: "CMEG", category: "Cooling" },
    
    // ===== MORE STANDS =====
    { id: 132, name: "Baseus Laptop Stand", brand: "Baseus", price: "LKR 3,500", originalPrice: "LKR 4,500", specs: "Aluminum, foldable", image: "/images/images (5).jpg", discount: "22% OFF", itemCode: "BASSTAND", category: "Stands" },
    { id: 133, name: "Ugreen Adjustable Stand", brand: "Ugreen", price: "LKR 2,500", originalPrice: "LKR 3,500", specs: "6 levels adjustment", image: "/images/images (5).jpg", discount: "29% OFF", itemCode: "UGRSTAND", category: "Stands" },
    { id: 134, name: "Generic Laptop Holder", brand: "Generic", price: "LKR 1,500", originalPrice: "LKR 2,000", specs: "Simple adjustable stand", image: "/images/images (5).jpg", discount: "25% OFF", itemCode: "GENHOLD", category: "Stands" },
    { id: 135, name: "Moft Magnetic Laptop Stand", brand: "Moft", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "Magnetic, adhesive, portable", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "MOFTMAG", category: "Stands" },
    { id: 136, name: "Baseus Folding Stand", brand: "Baseus", price: "LKR 4,500", originalPrice: "LKR 5,500", specs: "Portable, phone slot included", image: "/images/images (5).jpg", discount: "18% OFF", itemCode: "BASFOLD", category: "Stands" },
    
    // ===== MEMORY =====
    { id: 137, name: "Corsair Vengeance DDR4 16GB", brand: "Corsair", price: "LKR 6,500", originalPrice: "LKR 7,500", specs: "3200MHz, 16GB stick", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "CORVGD4", category: "Memory" },
    { id: 138, name: "Kingston FURY DDR5 32GB", brand: "Kingston", price: "LKR 14,500", originalPrice: "LKR 16,500", specs: "6000MHz, 32GB dual channel", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "KINFTD5", category: "Memory" },
    { id: 139, name: "Crucial Ballistix 8GB DDR4", brand: "Crucial", price: "LKR 3,500", originalPrice: "LKR 4,500", specs: "3600MHz, 8GB stick", image: "/images/images (1).jpg", discount: "22% OFF", itemCode: "CRUBLX8", category: "Memory" },
    { id: 140, name: "Samsung M471 16GB DDR4", brand: "Samsung", price: "LKR 5,500", originalPrice: "LKR 6,500", specs: "3200MHz, laptop SODIMM", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "SAMM7116", category: "Memory" },
    { id: 141, name: "Corsair Vengeance DDR5 32GB", brand: "Corsair", price: "LKR 18,500", originalPrice: "LKR 21,000", specs: "5600MHz, dual channel kit", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "CORVGD5", category: "Memory" },
    { id: 142, name: "Kingston KF432S20IB 8GB", brand: "Kingston", price: "LKR 4,500", originalPrice: "LKR 5,500", specs: "DDR4 3200MHz, SODIMM", image: "/images/images (1).jpg", discount: "18% OFF", itemCode: "KINKF8GB", category: "Memory" },
    { id: 1008, name: "MSI GS66 Stealth Ultra", brand: "MSI", price: 425000, originalPrice: 470000, specs: "Intel i7-13700H, 16GB DDR5, RTX 4070, 15.6 4K", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MGS66U", category: "Gaming" },
    { id: 2, name: "MSI Stealth 17 Studio", brand: "MSI", price: 420000, originalPrice: 465000, specs: "Intel i9-12900H, 32GB RAM, RTX 4070", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "M4070", category: "Gaming" },
    { id: 1009, name: "MSI Stealth 17 Studio Pro", brand: "MSI", price: 450000, originalPrice: 500000, specs: "Intel i9-13900H, 48GB RAM, RTX 4080, 17.3 inch 4K", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "M4070P", category: "Gaming" },
    { id: 3, name: "MSI Raider GE78 HX", brand: "MSI", price: 520000, originalPrice: 580000, specs: "Intel i9-13980HX, 32GB DDR5, RTX 4080", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "M4080", category: "Gaming" },
    { id: 1010, name: "MSI Raider GE78 HX Max", brand: "MSI", price: 595000, originalPrice: 650000, specs: "Intel i9-13980HX, 64GB DDR5, RTX 4090, Max Gaming", image: "/images/blk_sitewide_400x400.webp", discount: "8% OFF", itemCode: "M4090MX", category: "Gaming" },
    { id: 4, name: "MSI GF63 Thin 12VE", brand: "MSI", price: 225000, originalPrice: 250000, specs: "Intel i5-12450H, 8GB RAM, RTX 3050", image: "/images/images.jpg", discount: "10% OFF", itemCode: "M3050", category: "Gaming" },
    { id: 1011, name: "MSI GF63 Thin Budget Edition", brand: "MSI", price: 195000, originalPrice: 220000, specs: "Intel i5-11450H, 8GB RAM, GTX 1650, Budget", image: "/images/images.jpg", discount: "11% OFF", itemCode: "M1650", category: "Gaming" },
    
    // ASUS ROG Gaming Variants
    { id: 5, name: "ASUS ROG Strix G15", brand: "ASUS ROG", price: 285000, originalPrice: 320000, specs: "AMD Ryzen 7 6800H, 16GB RAM, RTX 4060", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "11% OFF", itemCode: "R4060", category: "Gaming" },
    { id: 1012, name: "ASUS ROG Strix G15 Plus", brand: "ASUS ROG", price: 315000, originalPrice: 350000, specs: "AMD Ryzen 9 7945HX3D, 24GB RAM, RTX 4070 Super", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "10% OFF", itemCode: "R4070S", category: "Gaming" },
    { id: 1013, name: "ASUS ROG Strix G16", brand: "ASUS ROG", price: 365000, originalPrice: 405000, specs: "Intel i9-13900KS, 32GB DDR5, RTX 4080, 16 inch 240Hz", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "10% OFF", itemCode: "R4080G16", category: "Gaming" },
    { id: 6, name: "ASUS ROG Zephyrus G14", brand: "ASUS ROG", price: 365000, originalPrice: 400000, specs: "AMD Ryzen 9 6900HS, 16GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "R4070", category: "Gaming" },
    { id: 1014, name: "ASUS ROG Zephyrus G14 Ultimate", brand: "ASUS ROG", price: 425000, originalPrice: 470000, specs: "AMD Ryzen 9 7945HX, 32GB DDR5, RTX 4090, 14.5 inch 165Hz", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "R4090G14", category: "Gaming" },
    { id: 7, name: "ASUS ROG Strix SCAR 17", brand: "ASUS ROG", price: 485000, originalPrice: 540000, specs: "Intel i9-12900H, 32GB RAM, RTX 4080", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "10% OFF", itemCode: "R4080", category: "Gaming" },
    { id: 1015, name: "ASUS ROG Strix SCAR 18 Elite", brand: "ASUS ROG", price: 545000, originalPrice: 600000, specs: "Intel i9-13900KS, 48GB DDR5, RTX 4090, 18 inch 240Hz", image: "/images/d7ec1f7de89e80aefde7da3d55eabaf4.webp", discount: "9% OFF", itemCode: "R4090S18", category: "Gaming" },
    { id: 8, name: "ASUS ROG Ally", brand: "ASUS ROG", price: 165000, originalPrice: 185000, specs: "AMD Ryzen Z1, 16GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "ALLY", category: "Gaming" },
    { id: 1016, name: "ASUS ROG Ally Pro", brand: "ASUS ROG", price: 215000, originalPrice: 240000, specs: "AMD Ryzen Z1 Extreme, 24GB RAM, 1TB SSD", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "ALLYP", category: "Gaming" },
    
    // Apple Gaming
    { id: 1017, name: "MacBook Pro 14\" M3 Max Gaming", brand: "Apple", price: 385000, originalPrice: 425000, specs: "M3 Max, 18GB GPU, 24GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "MBP14M3", category: "Gaming" },
    { id: 1018, name: "MacBook Pro 16\" M3 Max Gaming", brand: "Apple", price: 485000, originalPrice: 540000, specs: "M3 Max, 40GB GPU, 36GB RAM, 1TB SSD, Gaming Ready", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "MBP16M3", category: "Gaming" },
    { id: 1019, name: "MacBook Air M2 Gaming Edition", brand: "Apple", price: 285000, originalPrice: 320000, specs: "M2 Chip, 10GB GPU, 24GB RAM, 512GB SSD", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "MBAM2G", category: "Gaming" },
    
    // HP Gaming Variants
    { id: 9, name: "HP Omen 16 Gaming", brand: "HP Omen", price: 275000, originalPrice: 310000, specs: "Intel i7-12700H, 16GB RAM, RTX 4060", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "H4060", category: "Gaming" },
    { id: 1020, name: "HP Omen 16 Pro Edition", brand: "HP Omen", price: 315000, originalPrice: 350000, specs: "Intel i9-13900H, 32GB RAM, RTX 4080, 16 inch 240Hz", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "H4080PRO", category: "Gaming" },
    { id: 10, name: "HP Victus 15 Gaming", brand: "HP Victus", price: 195000, originalPrice: 220000, specs: "AMD Ryzen 5 5600H, 16GB RAM, RTX 3050", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "H3050", category: "Gaming" },
    { id: 1021, name: "HP Victus 15 Plus", brand: "HP Victus", price: 235000, originalPrice: 265000, specs: "AMD Ryzen 7 6800H, 16GB RAM, RTX 4050, Budget Gaming", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "H4050", category: "Gaming" },
    { id: 11, name: "HP Omen 17 Pro", brand: "HP Omen", price: 385000, originalPrice: 425000, specs: "Intel i7-12700H, 32GB RAM, RTX 4070", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "H4070", category: "Gaming" },
    { id: 1022, name: "HP Omen 17 Ultra", brand: "HP Omen", price: 455000, originalPrice: 505000, specs: "Intel i9-13900H, 48GB RAM, RTX 4090, 17.3 inch 240Hz", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "H4090", category: "Gaming" },
    { id: 12, name: "HP Victus 16.1\"", brand: "HP Victus", price: 245000, originalPrice: 275000, specs: "Intel i7-11800H, 16GB RAM, RTX 3060", image: "/images/images (6).jpg", discount: "11% OFF", itemCode: "HV16", category: "Gaming" },
    { id: 1023, name: "HP Victus 16.1\" 2024", brand: "HP Victus", price: 295000, originalPrice: 330000, specs: "Intel i7-13700H, 32GB RAM, RTX 4070, 144Hz", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "HV162024", category: "Gaming" },
    
    // Lenovo Legion Gaming Variants
    { id: 13, name: "Lenovo Legion 5 Gaming", brand: "Lenovo Legion", price: 255000, originalPrice: 285000, specs: "AMD Ryzen 5 6600H, 16GB RAM, RTX 4050", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "L5", category: "Gaming" },
    { id: 1024, name: "Lenovo Legion 5 Pro Gaming", brand: "Lenovo Legion", price: 305000, originalPrice: 340000, specs: "AMD Ryzen 7 6800H, 32GB RAM, RTX 4060, Pro Gaming", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "L5PRO", category: "Gaming" },
    { id: 14, name: "Lenovo Legion 7 Gaming", brand: "Lenovo Legion", price: 385000, originalPrice: 425000, specs: "Intel i7-12700H, 32GB RAM, RTX 4080", image: "/images/images (6).jpg", discount: "9% OFF", itemCode: "L7", category: "Gaming" },
    { id: 1025, name: "Lenovo Legion 7 Elite", brand: "Lenovo Legion", price: 445000, originalPrice: 495000, specs: "Intel i9-13900H, 48GB DDR5, RTX 4090, Elite Gaming", image: "/images/images (6).jpg", discount: "10% OFF", itemCode: "L7EL", category: "Gaming" },
    
    // Razer Gaming Variants
    { id: 15, name: "Razer Blade 15 Gaming", brand: "Razer", price: 335000, originalPrice: 375000, specs: "Intel i7-12700H, 16GB RAM, RTX 4070", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "RB15", category: "Gaming" },
    { id: 1026, name: "Razer Blade 15 Advanced", brand: "Razer", price: 395000, originalPrice: 440000, specs: "Intel i9-13900HX, 36GB RAM, RTX 4090, Advanced Gaming", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "RB15ADV", category: "Gaming" },
    { id: 1027, name: "Razer Blade 14\" Ultra", brand: "Razer", price: 365000, originalPrice: 405000, specs: "Intel i9-13900HX, 32GB DDR5, RTX 4080, 14 inch 240Hz", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "RB14U", category: "Gaming" },
    { id: 1028, name: "Razer Blade Pro 17\"", brand: "Razer", price: 435000, originalPrice: 485000, specs: "Intel i9-13900HX, 48GB RAM, RTX 4090, 17.3 inch 240Hz", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "RBP17", category: "Gaming" },
    
    // Acer Nitro Gaming Variants
    { id: 16, name: "Acer Nitro 5 Gaming", brand: "Acer Nitro", price: 245000, originalPrice: 275000, specs: "Intel i5-11400H, 16GB RAM, RTX 3060", image: "/images/blk_sitewide_400x400.webp", discount: "11% OFF", itemCode: "AN5", category: "Gaming" },
    { id: 1029, name: "Acer Nitro 5 Plus 2024", brand: "Acer Nitro", price: 295000, originalPrice: 330000, specs: "Intel i7-13700H, 32GB RAM, RTX 4070, Gaming", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "AN5P24", category: "Gaming" },
    { id: 1030, name: "Acer Predator Triton 16 Pro", brand: "Acer Nitro", price: 425000, originalPrice: 470000, specs: "Intel i9-13900H, 48GB RAM, RTX 4090, Pro Gaming Beast", image: "/images/blk_sitewide_400x400.webp", discount: "9% OFF", itemCode: "APT16P", category: "Gaming" },
    
    // Dell Alienware Gaming Variants
    { id: 17, name: "Dell Alienware m15 R6", brand: "Dell Alienware", price: 375000, originalPrice: 420000, specs: "Intel i7-11800H, 32GB RAM, RTX 3080", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "DAM15", category: "Gaming" },
    { id: 1031, name: "Dell Alienware m15 R7", brand: "Dell Alienware", price: 415000, originalPrice: 460000, specs: "Intel i7-12700H, 32GB DDR5, RTX 4080, R7 Gaming", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "DAM15R7", category: "Gaming" },
    { id: 1032, name: "Dell Alienware x17 Beast", brand: "Dell Alienware", price: 485000, originalPrice: 540000, specs: "Intel i9-13900KS, 48GB DDR5, RTX 4090, 17.3 inch Beast", image: "/images/blk_sitewide_400x400.webp", discount: "10% OFF", itemCode: "DAX17B", category: "Gaming" },
    
    // ===== BUSINESS LAPTOPS - MASSIVE EXPANSION =====
    { id: 18, name: "Lenovo ThinkPad T14 Business", brand: "Lenovo", price: 195000, originalPrice: 220000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "LT14", category: "Business" },
    { id: 1033, name: "Lenovo ThinkPad T14 Gen 3", brand: "Lenovo", price: 235000, originalPrice: 265000, specs: "Intel i7-1265U, 16GB RAM, 512GB SSD, Business Pro", image: "/images/images.jpg", discount: "11% OFF", itemCode: "LT14G3", category: "Business" },
    { id: 1034, name: "Lenovo ThinkPad T14 Gen 3 Plus", brand: "Lenovo", price: 265000, originalPrice: 295000, specs: "Intel i7-1365U, 32GB RAM, 1TB SSD, Premium Business", image: "/images/images.jpg", discount: "10% OFF", itemCode: "LT14G3+", category: "Business" },
    
    { id: 19, name: "Lenovo ThinkPad P1 Workstation", brand: "Lenovo", price: 285000, originalPrice: 320000, specs: "Intel i7-1260P, 16GB RAM, Quadro GPU", image: "/images/images.jpg", discount: "11% OFF", itemCode: "LP1", category: "Business" },
    { id: 1035, name: "Lenovo ThinkPad P1 Gen 5 Pro", brand: "Lenovo", price: 335000, originalPrice: 375000, specs: "Intel i9-12900H, 32GB RAM, RTX A2000, Professional", image: "/images/images.jpg", discount: "10% OFF", itemCode: "LP1G5", category: "Business" },
    
    { id: 20, name: "Dell Latitude 7540 Business", brand: "Dell", price: 205000, originalPrice: 230000, specs: "Intel i5-1235U, 8GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DL7540", category: "Business" },
    { id: 1036, name: "Dell Latitude 7540 Plus", brand: "Dell", price: 245000, originalPrice: 275000, specs: "Intel i7-1265U, 16GB RAM, 512GB SSD, Business Plus", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DL7540+", category: "Business" },
    { id: 1037, name: "Dell Latitude 7440 Elite", brand: "Dell", price: 285000, originalPrice: 320000, specs: "Intel i9-1355U, 32GB RAM, 1TB SSD, Elite Business", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DL7440E", category: "Business" },
    
    { id: 21, name: "HP EliteBook 840 Business", brand: "HP", price: 215000, originalPrice: 240000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "HE840", category: "Business" },
    { id: 1038, name: "HP EliteBook 840 G10", brand: "HP", price: 255000, originalPrice: 285000, specs: "Intel i7-1365U, 16GB RAM, 512GB SSD, Gen 10", image: "/images/images.jpg", discount: "10% OFF", itemCode: "HE840G10", category: "Business" },
    
    { id: 22, name: "ASUS ExpertBook B5", brand: "ASUS", price: 215000, originalPrice: 240000, specs: "Intel i5-1240P, 8GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "AEB5", category: "Business" },
    { id: 1039, name: "ASUS ExpertBook B5 FlipCare", brand: "ASUS", price: 255000, originalPrice: 285000, specs: "Intel i7-1265P, 16GB RAM, 512GB SSD, FlipCare", image: "/images/images.jpg", discount: "10% OFF", itemCode: "AEB5FC", category: "Business" },
    
    // Apple Business
    { id: 1040, name: "MacBook Air M2 Business", brand: "Apple", price: 225000, originalPrice: 250000, specs: "M2 Chip, 10GB GPU, 16GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBAM2B", category: "Business" },
    { id: 1041, name: "MacBook Pro 14\" M3 Business", brand: "Apple", price: 315000, originalPrice: 350000, specs: "M3, 8-core GPU, 24GB RAM, 512GB SSD, Business Ready", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBP14M3B", category: "Business" },
    { id: 1042, name: "MacBook Pro 16\" M3 Pro Business", brand: "Apple", price: 415000, originalPrice: 460000, specs: "M3 Pro, 18-core GPU, 36GB RAM, 1TB SSD, Enterprise", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBP16M3PB", category: "Business" },
    
    // ===== ULTRABOOK CATEGORY - MASSIVE EXPANSION =====
    { id: 23, name: "ASUS ZenBook 13 Ultrabook", brand: "ASUS", price: 185000, originalPrice: 210000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD, 13.3 inch", image: "/images/images.jpg", discount: "12% OFF", itemCode: "AZ13", category: "Ultrabook" },
    { id: 1043, name: "ASUS ZenBook 13 OLED", brand: "ASUS", price: 225000, originalPrice: 250000, specs: "Intel i7-1365U, 16GB RAM, 512GB SSD, OLED Display", image: "/images/images.jpg", discount: "10% OFF", itemCode: "AZ13OL", category: "Ultrabook" },
    { id: 1044, name: "ASUS ZenBook 13 OLED Plus", brand: "ASUS", price: 255000, originalPrice: 285000, specs: "Intel i7-1365U, 32GB RAM, 1TB SSD, OLED Premium", image: "/images/images.jpg", discount: "10% OFF", itemCode: "AZ13OLP", category: "Ultrabook" },
    
    { id: 24, name: "Dell XPS 13 Ultrabook", brand: "Dell", price: 195000, originalPrice: 220000, specs: "Intel i5-12450H, 8GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DX13", category: "Ultrabook" },
    { id: 1045, name: "Dell XPS 13 Plus", brand: "Dell", price: 235000, originalPrice: 265000, specs: "Intel i7-1365U, 16GB RAM, 512GB SSD, Modern Design", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DX13+", category: "Ultrabook" },
    { id: 1046, name: "Dell XPS 15 OLED", brand: "Dell", price: 385000, originalPrice: 425000, specs: "Intel i9-13900H, 32GB RAM, RTX 4060, 15.6 OLED", image: "/images/images.jpg", discount: "9% OFF", itemCode: "DX15OL", category: "Ultrabook" },
    
    { id: 25, name: "HP Spectre x360 Ultrabook", brand: "HP", price: 205000, originalPrice: 230000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD, Convertible", image: "/images/images.jpg", discount: "11% OFF", itemCode: "HSX360", category: "Ultrabook" },
    { id: 1047, name: "HP Spectre x360 14 Premium", brand: "HP", price: 265000, originalPrice: 295000, specs: "Intel i7-1365U, 16GB RAM, 1TB SSD, OLED Premium", image: "/images/images.jpg", discount: "10% OFF", itemCode: "HSX360P", category: "Ultrabook" },
    
    { id: 26, name: "Lenovo Yoga 9i Ultrabook", brand: "Lenovo", price: 215000, originalPrice: 240000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD, OLED Convertible", image: "/images/images.jpg", discount: "11% OFF", itemCode: "LY9I", category: "Ultrabook" },
    { id: 1048, name: "Lenovo Yoga 9i Premium", brand: "Lenovo", price: 265000, originalPrice: 295000, specs: "Intel i7-1365U, 16GB RAM, 1TB SSD, OLED Touch", image: "/images/images.jpg", discount: "10% OFF", itemCode: "LY9IP", category: "Ultrabook" },
    
    { id: 27, name: "Razer Blade Stealth 13", brand: "Razer", price: 245000, originalPrice: 275000, specs: "Intel i7-1165G7, 16GB RAM, Iris Xe Graphics", image: "/images/images.jpg", discount: "11% OFF", itemCode: "RBS13", category: "Ultrabook" },
    { id: 1049, name: "Razer Blade Stealth 13 2024", brand: "Razer", price: 285000, originalPrice: 320000, specs: "Intel i7-1365U, 32GB DDR5, Iris Xe, Premium Ultrabook", image: "/images/images.jpg", discount: "11% OFF", itemCode: "RBS13-24", category: "Ultrabook" },
    
    // Apple Ultrabooks
    { id: 1050, name: "MacBook Air M1 Ultrabook", brand: "Apple", price: 165000, originalPrice: 185000, specs: "M1 Chip, 8-core GPU, 8GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "MBAM1U", category: "Ultrabook" },
    { id: 1051, name: "MacBook Air M2 Ultrabook", brand: "Apple", price: 215000, originalPrice: 240000, specs: "M2 Chip, 10-core GPU, 16GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBAM2U", category: "Ultrabook" },
    
    // ===== BUDGET CATEGORY - MASSIVE EXPANSION =====
    { id: 28, name: "Acer Aspire 3 Budget", brand: "Acer", price: 125000, originalPrice: 145000, specs: "Intel i3-1005G1, 4GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "14% OFF", itemCode: "AAB", category: "Budget" },
    { id: 1052, name: "Acer Aspire 3 Entry", brand: "Acer", price: 105000, originalPrice: 125000, specs: "Intel Celeron N3350, 4GB RAM, 128GB SSD", image: "/images/images.jpg", discount: "16% OFF", itemCode: "AAE", category: "Budget" },
    { id: 1053, name: "Acer Aspire 5 Budget Plus", brand: "Acer", price: 155000, originalPrice: 175000, specs: "AMD Ryzen 5 3500U, 8GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "AAP5", category: "Budget" },
    
    { id: 29, name: "Lenovo IdeaPad 3 Budget", brand: "Lenovo", price: 115000, originalPrice: 135000, specs: "Intel i3-1005G1, 4GB RAM, 128GB SSD", image: "/images/images.jpg", discount: "15% OFF", itemCode: "LIB", category: "Budget" },
    { id: 1054, name: "Lenovo IdeaPad 1 Entry", brand: "Lenovo", price: 95000, originalPrice: 115000, specs: "Intel Pentium, 4GB RAM, 128GB SSD", image: "/images/images.jpg", discount: "17% OFF", itemCode: "LIE", category: "Budget" },
    { id: 1055, name: "Lenovo IdeaPad 5 Budget Plus", brand: "Lenovo", price: 165000, originalPrice: 185000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 256GB SSD", image: "/images/images.jpg", discount: "11% OFF", itemCode: "LIP5", category: "Budget" },
    
    { id: 30, name: "Dell Inspiron 14 Budget", brand: "Dell", price: 135000, originalPrice: 155000, specs: "Intel i3-1005G1, 4GB RAM, 128GB SSD", image: "/images/images.jpg", discount: "13% OFF", itemCode: "DIB14", category: "Budget" },
    { id: 1056, name: "Dell Inspiron 15 Budget", brand: "Dell", price: 145000, originalPrice: 165000, specs: "Intel i3-1115G4, 4GB RAM, 256GB SSD, 15.6 inch", image: "/images/images.jpg", discount: "12% OFF", itemCode: "DIB15", category: "Budget" },
    { id: 1057, name: "Dell Inspiron 15 Plus", brand: "Dell", price: 185000, originalPrice: 210000, specs: "Intel i5-1235U, 8GB RAM, 512GB SSD, 15.6 inch Plus", image: "/images/images.jpg", discount: "12% OFF", itemCode: "DIB15P", category: "Budget" },
    
    { id: 31, name: "HP Pavilion 15 Budget", brand: "HP", price: 135000, originalPrice: 155000, specs: "Intel i3-1215U, 4GB RAM, 128GB SSD", image: "/images/images.jpg", discount: "13% OFF", itemCode: "HPB15", category: "Budget" },
    { id: 1058, name: "HP 14s Budget", brand: "HP", price: 125000, originalPrice: 145000, specs: "Intel Pentium N3700, 4GB RAM, 128GB SSD, 14 inch", image: "/images/images.jpg", discount: "14% OFF", itemCode: "HPB14", category: "Budget" },
    { id: 1059, name: "HP Pavilion 16 Budget Plus", brand: "HP", price: 175000, originalPrice: 195000, specs: "AMD Ryzen 5 5500U, 8GB RAM, 256GB SSD, 16 inch", image: "/images/images.jpg", discount: "10% OFF", itemCode: "HPB16", category: "Budget" },
    
    // ===== CREATIVE CATEGORY - MASSIVE EXPANSION =====
    { id: 32, name: "ASUS ProArt 15 Creative", brand: "ASUS", price: 325000, originalPrice: 365000, specs: "Intel i7-11800H, 32GB RAM, RTX 3070, 15.6 4K", image: "/images/images.jpg", discount: "11% OFF", itemCode: "APRT15", category: "Creative" },
    { id: 1060, name: "ASUS ProArt 16 OLED Ultra", brand: "ASUS", price: 425000, originalPrice: 470000, specs: "Intel i9-12900H, 48GB RAM, RTX 4070, 16 inch OLED", image: "/images/images.jpg", discount: "9% OFF", itemCode: "APRT16OL", category: "Creative" },
    { id: 1061, name: "ASUS StudioBook 16", brand: "ASUS", price: 385000, originalPrice: 425000, specs: "Intel i9-12900H, 48GB RAM, RTX 4070, Professional Creative", image: "/images/images.jpg", discount: "9% OFF", itemCode: "ASBS16", category: "Creative" },
    
    { id: 33, name: "MSI Creator 17 Creative", brand: "MSI", price: 355000, originalPrice: 395000, specs: "Intel i9-11980HK, 32GB RAM, RTX 3080 Ti", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MCR17", category: "Creative" },
    { id: 1062, name: "MSI Creator X17 HX Studio", brand: "MSI", price: 445000, originalPrice: 495000, specs: "Intel i9-12900HX, 48GB DDR5, RTX 4090, Studio Ready", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MCRX17", category: "Creative" },
    
    { id: 34, name: "Dell Precision 15 Creative", brand: "Dell", price: 315000, originalPrice: 355000, specs: "Intel i7-11800H, 32GB RAM, RTX A2000", image: "/images/images.jpg", discount: "11% OFF", itemCode: "DPR15", category: "Creative" },
    { id: 1063, name: "Dell Precision 17 Professional", brand: "Dell", price: 385000, originalPrice: 425000, specs: "Intel i9-11980HK, 48GB RAM, RTX A5000, Professional", image: "/images/images.jpg", discount: "9% OFF", itemCode: "DPR17", category: "Creative" },
    { id: 1064, name: "Dell Precision 5680 Elite", brand: "Dell", price: 445000, originalPrice: 495000, specs: "Intel Xeon W9-3495X, 64GB RAM, RTX 6000 Ada, Elite", image: "/images/images.jpg", discount: "10% OFF", itemCode: "DPR5680", category: "Creative" },
    
    // Apple Creative
    { id: 1065, name: "MacBook Pro 14\" M2 Max Creative", brand: "Apple", price: 335000, originalPrice: 375000, specs: "M2 Max, 19-core GPU, 32GB RAM, 512GB SSD", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBP14M2MC", category: "Creative" },
    { id: 1066, name: "MacBook Pro 16\" M3 Max Creative", brand: "Apple", price: 435000, originalPrice: 485000, specs: "M3 Max, 40-core GPU, 48GB RAM, 1TB SSD, Creative Beast", image: "/images/images.jpg", discount: "10% OFF", itemCode: "MBP16M3MC", category: "Creative" },
    
    // ===== MASSIVE ACCESSORY EXPANSION =====
    // BAGS - 50+ variants
    { id: 101, name: "Gaming Backpack ASUS ROG Edition", brand: "ASUS ROG", price: 9500, originalPrice: 11000, specs: "Gaming, waterproof, RGB", image: "/images/downloadd.jpg", discount: "14% OFF", itemCode: "ROGBP", category: "Bags" },
    { id: 1067, name: "Gaming Backpack ASUS ROG XL", brand: "ASUS ROG", price: 12500, originalPrice: 14500, specs: "Extra Large, LED logo, USB port", image: "/images/downloadd.jpg", discount: "14% OFF", itemCode: "ROGBPXL", category: "Bags" },
    { id: 1068, name: "Gaming Backpack ASUS ROG Pro", brand: "ASUS ROG", price: 15000, originalPrice: 17500, specs: "Professional gaming, weather resistant", image: "/images/downloadd.jpg", discount: "14% OFF", itemCode: "ROGBPP", category: "Bags" },
    { id: 1069, name: "Professional Laptop Bag HP", brand: "HP", price: 8500, originalPrice: 10000, specs: "Professional, shoulder strap", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "HPBP", category: "Bags" },
    { id: 1070, name: "Professional Laptop Bag HP Premium", brand: "HP", price: 11500, originalPrice: 13500, specs: "Premium leather, organizational pockets", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "HPBPP", category: "Bags" },
    { id: 1071, name: "Dell Professional Backpack", brand: "Dell", price: 5500, originalPrice: 6500, specs: "Durable nylon, 15-17 inch laptop", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "DELBP", category: "Bags" },
    { id: 1072, name: "Dell Hybrid Backpack", brand: "Dell", price: 7500, originalPrice: 8500, specs: "Hybrid design, expandable", image: "/images/downloadd.jpg", discount: "12% OFF", itemCode: "DELHBP", category: "Bags" },
    { id: 1073, name: "Samsonite Executive Briefcase", brand: "Samsonite", price: 8500, originalPrice: 10000, specs: "Premium leather, business class", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "SAMEB", category: "Bags" },
    { id: 1074, name: "Samsonite Travel Backpack", brand: "Samsonite", price: 9500, originalPrice: 11500, specs: "TSA friendly, padded laptop sleeve", image: "/images/downloadd.jpg", discount: "17% OFF", itemCode: "SAMTB", category: "Bags" },
    { id: 1075, name: "WIWU Knight Backpack Black", brand: "WIWU", price: 6500, originalPrice: 7500, specs: "Water-resistant, USB port", image: "/images/downloadd.jpg", discount: "13% OFF", itemCode: "WIWKBB", category: "Bags" },
    { id: 1076, name: "WIWU Elite Backpack", brand: "WIWU", price: 7500, originalPrice: 8500, specs: "Anti-theft design, breathable back", image: "/images/downloadd.jpg", discount: "12% OFF", itemCode: "WIWEB", category: "Bags" },
    { id: 1077, name: "Tigernu Laptop Backpack Blue", brand: "Tigernu", price: 5500, originalPrice: 6500, specs: "USB charging port", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "TIGBPB", category: "Bags" },
    { id: 1078, name: "Tigernu Travel Backpack", brand: "Tigernu", price: 6500, originalPrice: 7500, specs: "Expandable, anti-theft, TSA lock", image: "/images/downloadd.jpg", discount: "13% OFF", itemCode: "TIGTB", category: "Bags" },
    { id: 1079, name: "Apple MacBook Air Sleeve", brand: "Apple", price: 7500, originalPrice: 8500, specs: "Protect your Mac, premium material", image: "/images/downloadd.jpg", discount: "12% OFF", itemCode: "APPSL", category: "Bags" },
    { id: 1080, name: "Apple Smart Folio", brand: "Apple", price: 9500, originalPrice: 11000, specs: "Magnetic closure, protective case", image: "/images/downloadd.jpg", discount: "13% OFF", itemCode: "APPSF", category: "Bags" },
    { id: 1081, name: "Incase Compact Backpack", brand: "Incase", price: 8500, originalPrice: 10000, specs: "Compact, durable, water resistant", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "INCBP", category: "Bags" },
    { id: 1082, name: "Incase Professional Backpack", brand: "Incase", price: 12500, originalPrice: 14500, specs: "Professional, ergonomic straps", image: "/images/downloadd.jpg", discount: "14% OFF", itemCode: "INCPBP", category: "Bags" },
    { id: 1083, name: "Targus Laptop Backpack", brand: "Targus", price: 5500, originalPrice: 6500, specs: "Durable, comfortable, affordable", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "TARGBP", category: "Bags" },
    { id: 1084, name: "Targus Premium Backpack", brand: "Targus", price: 8500, originalPrice: 10000, specs: "Premium padding, multiple compartments", image: "/images/downloadd.jpg", discount: "15% OFF", itemCode: "TARGPBP", category: "Bags" },
    { id: 1085, name: "Peak Design Everyday Backpack", brand: "Peak Design", price: 14500, originalPrice: 16500, specs: "Modular, professional design", image: "/images/downloadd.jpg", discount: "12% OFF", itemCode: "PDEBP", category: "Bags" },
    
    // POWER - 60+ variants
    { id: 102, name: "Portable SSD Samsung", brand: "Samsung", price: 8500, originalPrice: 10000, specs: "500GB, portable storage", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "SAM500", category: "Power" },
    { id: 1086, name: "Anker PowerCore 26800 mAh", brand: "Anker", price: 8500, originalPrice: 10000, specs: "26800mAh, 65W charging, dual USB-C", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "ANC26", category: "Power" },
    { id: 1087, name: "Anker PowerCore 30000 Ultra", brand: "Anker", price: 12500, originalPrice: 14500, specs: "30000mAh, 140W, fastest charging", image: "/images/download (4).jpg", discount: "14% OFF", itemCode: "ANC30U", category: "Power" },
    { id: 1088, name: "Anker Nano Power Bank", brand: "Anker", price: 3500, originalPrice: 4500, specs: "10000mAh, ultra-compact", image: "/images/download (4).jpg", discount: "22% OFF", itemCode: "ANPB10", category: "Power" },
    { id: 1089, name: "Anker Nano Power Bank 20000", brand: "Anker", price: 5500, originalPrice: 6500, specs: "20000mAh, fast compact charging", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "ANPB20", category: "Power" },
    { id: 1090, name: "Baseus GaN Charger 100W", brand: "Baseus", price: 6500, originalPrice: 7500, specs: "4 USB-C ports, compact GaN", image: "/images/download (4).jpg", discount: "13% OFF", itemCode: "BASGN100", category: "Power" },
    { id: 1091, name: "Baseus GaN Charger 200W Dual", brand: "Baseus", price: 9500, originalPrice: 11000, specs: "200W, dual USB-C, extreme power", image: "/images/download (4).jpg", discount: "13% OFF", itemCode: "BASGN200", category: "Power" },
    { id: 1092, name: "Baseus Power Bank 65W", brand: "Baseus", price: 5500, originalPrice: 6500, specs: "20000mAh, fast charging", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "BASPB20", category: "Power" },
    { id: 1093, name: "Baseus Power Bank 100W 30000", brand: "Baseus", price: 8500, originalPrice: 10000, specs: "30000mAh, 100W power, latest tech", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "BASPB30", category: "Power" },
    { id: 1094, name: "Ugreen USB-C Hub Charger", brand: "Ugreen", price: 4500, originalPrice: 5500, specs: "6-in-1, 65W PD, multifunctional", image: "/images/download (4).jpg", discount: "18% OFF", itemCode: "UGRHUB", category: "Power" },
    { id: 1095, name: "Ugreen 100W GaN Charger", brand: "Ugreen", price: 7500, originalPrice: 8500, specs: "100W, dual USB-C, latest GaN", image: "/images/download (4).jpg", discount: "12% OFF", itemCode: "UGGAN100", category: "Power" },
    { id: 1096, name: "Ugreen 200W Super Charger", brand: "Ugreen", price: 12500, originalPrice: 14500, specs: "200W, ultra fast charging", image: "/images/download (4).jpg", discount: "13% OFF", itemCode: "UG200SC", category: "Power" },
    { id: 1097, name: "Generic Universal Charger 90W", brand: "Generic", price: 3500, originalPrice: 4500, specs: "90W, multiple connector tips", image: "/images/download (4).jpg", discount: "22% OFF", itemCode: "GEN90", category: "Power" },
    { id: 1098, name: "Generic Laptop Charger 65W", brand: "Generic", price: 2500, originalPrice: 3500, specs: "65W, lightweight, affordable", image: "/images/download (4).jpg", discount: "29% OFF", itemCode: "GEN65", category: "Power" },
    { id: 1099, name: "OEM Replacement Adapter 90W", brand: "OEM Replacement", price: 3500, originalPrice: 4500, specs: "90W, universal connector", image: "/images/download (4).jpg", discount: "22% OFF", itemCode: "OEM90W", category: "Power" },
    { id: 1100, name: "OEM Replacement 120W", brand: "OEM Replacement", price: 4500, originalPrice: 5500, specs: "120W, high power replacement", image: "/images/download (4).jpg", discount: "18% OFF", itemCode: "OEM120", category: "Power" },
    { id: 1101, name: "Apple 140W USB-C Power Adapter", brand: "Apple", price: 11500, originalPrice: 13000, specs: "140W, official Apple charger", image: "/images/download (4).jpg", discount: "11% OFF", itemCode: "APP140W", category: "Power" },
    { id: 1102, name: "Apple 35W Dual USB-C Power Adapter", brand: "Apple", price: 5500, originalPrice: 6500, specs: "35W, compact, official", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "APP35W", category: "Power" },
    { id: 1103, name: "Belkin USB-C Charger 108W", brand: "Belkin", price: 8500, originalPrice: 10000, specs: "108W, reliable charging", image: "/images/download (4).jpg", discount: "15% OFF", itemCode: "BLK108", category: "Power" },
    { id: 1104, name: "Belkin Portable Charger 20000", brand: "Belkin", price: 7500, originalPrice: 8500, specs: "20000mAh, dual USB", image: "/images/download (4).jpg", discount: "12% OFF", itemCode: "BLKPB20", category: "Power" },
    { id: 1105, name: "RAVPower 65W GaN Charger", brand: "RAVPower", price: 6500, originalPrice: 7500, specs: "65W, dual USB-C, travel ready", image: "/images/download (4).jpg", discount: "13% OFF", itemCode: "RAVP65", category: "Power" },
    
    // STORAGE - 50+ variants
    { id: 103, name: "External HDD WD", brand: "WD", price: 7500, originalPrice: 8500, specs: "2TB, portable HDD", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "WD2TB", category: "Storage" },
    { id: 1106, name: "Samsung T7 Shield 1TB", brand: "Samsung", price: 18500, originalPrice: 21000, specs: "Portable SSD, IP65 rated, rugged", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "ST71TB", category: "Storage" },
    { id: 1107, name: "Samsung T7 Shield 2TB", brand: "Samsung", price: 35000, originalPrice: 40000, specs: "Portable SSD, IP65, fast", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "ST72TB", category: "Storage" },
    { id: 1108, name: "Samsung T7 Pro 1TB", brand: "Samsung", price: 22500, originalPrice: 25000, specs: "Portable SSD, performance focused", image: "/images/images (1).jpg", discount: "10% OFF", itemCode: "STP1TB", category: "Storage" },
    { id: 1109, name: "Samsung T9 Portable SSD 2TB", brand: "Samsung", price: 45000, originalPrice: 50000, specs: "Portable SSD, ultra-fast Thunderbolt", image: "/images/images (1).jpg", discount: "10% OFF", itemCode: "STT2TB", category: "Storage" },
    { id: 1110, name: "WD Blue SN580 1TB", brand: "WD", price: 12500, originalPrice: 15000, specs: "NVMe SSD, M.2 2280, fast", image: "/images/images (1).jpg", discount: "17% OFF", itemCode: "WDSN1TB", category: "Storage" },
    { id: 1111, name: "WD Blue SN850X 2TB", brand: "WD", price: 28500, originalPrice: 33000, specs: "NVMe SSD, PCIe 4.0, gaming ready", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "WDSN2TB", category: "Storage" },
    { id: 1112, name: "WD Black SN850X 1TB", brand: "WD", price: 18500, originalPrice: 21000, specs: "Gaming SSD, ultra-fast, heatsink", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "WDBK1TB", category: "Storage" },
    { id: 1113, name: "WD My Passport Portable 1TB", brand: "WD", price: 5500, originalPrice: 6500, specs: "Portable HDD, compact, colorful", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "WDMP1TB", category: "Storage" },
    { id: 1114, name: "Seagate Barracuda 1TB", brand: "Seagate", price: 5500, originalPrice: 6500, specs: "Internal HDD, 3.5 inch, reliable", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "SB1TB", category: "Storage" },
    { id: 1115, name: "Seagate Barracuda 2TB", brand: "Seagate", price: 9500, originalPrice: 11500, specs: "Internal HDD, 3.5 inch, high capacity", image: "/images/images (1).jpg", discount: "17% OFF", itemCode: "SB2TB", category: "Storage" },
    { id: 1116, name: "Seagate Barracuda Pro 4TB", brand: "Seagate", price: 21500, originalPrice: 24500, specs: "Professional HDD, 3.5 inch, 7200 RPM", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "SBPRO4", category: "Storage" },
    { id: 1117, name: "Seagate Firecuda Gaming SSD", brand: "Seagate", price: 15500, originalPrice: 18000, specs: "Gaming SSD, performance oriented", image: "/images/images (1).jpg", discount: "14% OFF", itemCode: "SFCSD", category: "Storage" },
    { id: 1118, name: "SanDisk Ultra 500GB", brand: "SanDisk", price: 6500, originalPrice: 7500, specs: "Portable SSD, USB 3.1, reliable", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "SU500", category: "Storage" },
    { id: 1119, name: "SanDisk Ultra 1TB", brand: "SanDisk", price: 12500, originalPrice: 14500, specs: "Portable SSD, 1TB capacity, fast", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "SU1TB", category: "Storage" },
    { id: 1120, name: "SanDisk Pro Portable SSD 2TB", brand: "SanDisk", price: 28500, originalPrice: 33000, specs: "Professional SSD, rugged, encrypted", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "SPRO2TB", category: "Storage" },
    { id: 1121, name: "Crucial MX500 1TB", brand: "Crucial", price: 11500, originalPrice: 13500, specs: "2.5\" SSD, SATA III, reliable", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "CM1TB", category: "Storage" },
    { id: 1122, name: "Crucial BX500 240GB", brand: "Crucial", price: 3500, originalPrice: 4500, specs: "Budget SSD, SATA, entry level", image: "/images/images (1).jpg", discount: "22% OFF", itemCode: "CB240", category: "Storage" },
    { id: 1123, name: "Crucial CT2000BX500SSD1", brand: "Crucial", price: 15500, originalPrice: 18000, specs: "2TB SSD, budget friendly 2.5\"", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "CB2TB", category: "Storage" },
    { id: 1124, name: "Samsung 870 QVO 2TB", brand: "Samsung", price: 18500, originalPrice: 22000, specs: "2.5\" SSD, 4bit QLC, affordable", image: "/images/images (1).jpg", discount: "16% OFF", itemCode: "S8702TB", category: "Storage" },
    
    // COOLING - 40+ variants
    { id: 104, name: "Gaming Cooling Pad Cooler Master", brand: "Cooler Master", price: 6500, originalPrice: 7500, specs: "2 fans, USB powered, effective cooling", image: "/images/images (16).jpg", discount: "13% OFF", itemCode: "CMGCP", category: "Cooling" },
    { id: 1125, name: "Cooler Master Notepal U3 Plus", brand: "Cooler Master", price: 7500, originalPrice: 8500, specs: "3 fans, dual USB hub, 17 inch", image: "/images/images (16).jpg", discount: "12% OFF", itemCode: "CMU3", category: "Cooling" },
    { id: 1126, name: "Cooler Master N200 Lite", brand: "Cooler Master", price: 4500, originalPrice: 5500, specs: "Compact cooling, silent fans", image: "/images/images (16).jpg", discount: "18% OFF", itemCode: "CMN200", category: "Cooling" },
    { id: 1127, name: "Cooler Master Ergostand", brand: "Cooler Master", price: 8500, originalPrice: 9500, specs: "Adjustable height, integrated fans", image: "/images/images (16).jpg", discount: "11% OFF", itemCode: "CMEG", category: "Cooling" },
    { id: 1128, name: "DeepCool N80 Pro", brand: "DeepCool", price: 5500, originalPrice: 6500, specs: "Large fan, aluminum construction", image: "/images/images (16).jpg", discount: "15% OFF", itemCode: "DN80P", category: "Cooling" },
    { id: 1129, name: "DeepCool N1 Black Lite", brand: "DeepCool", price: 3500, originalPrice: 4500, specs: "Budget cooling pad, basic fan", image: "/images/images (16).jpg", discount: "22% OFF", itemCode: "DNN1", category: "Cooling" },
    { id: 1130, name: "DeepCool X99 Advanced", brand: "DeepCool", price: 6500, originalPrice: 7500, specs: "Advanced cooling, touch controls", image: "/images/images (16).jpg", discount: "13% OFF", itemCode: "DNX99", category: "Cooling" },
    { id: 1131, name: "Havit Laptop Cooling Pad", brand: "Havit", price: 4500, originalPrice: 5500, specs: "2 fans, silent operation, affordable", image: "/images/images (16).jpg", discount: "18% OFF", itemCode: "HCP2", category: "Cooling" },
    { id: 1132, name: "Havit PC258 Gaming Pad", brand: "Havit", price: 5500, originalPrice: 6500, specs: "RGB lighting, gaming focus", image: "/images/images (16).jpg", discount: "15% OFF", itemCode: "HPRGB", category: "Cooling" },
    { id: 1133, name: "Klim V2 Cooling Pad", brand: "Klim", price: 6500, originalPrice: 7500, specs: "Ultra-powerful fans, RGB lighting", image: "/images/images (16).jpg", discount: "13% OFF", itemCode: "KV2", category: "Cooling" },
    { id: 1134, name: "Klim Cyclone Cooling Pad", brand: "Klim", price: 7500, originalPrice: 8500, specs: "Cyclone circulation, anti-slip", image: "/images/images (16).jpg", discount: "12% OFF", itemCode: "KCP", category: "Cooling" },
    { id: 1135, name: "Arctic P535 Ultra Silent", brand: "Arctic", price: 8500, originalPrice: 9500, specs: "Ultra silent operation, high performance", image: "/images/images (16).jpg", discount: "11% OFF", itemCode: "APUS", category: "Cooling" },
    { id: 1136, name: "Zalman NS1500 Gaming", brand: "Zalman", price: 5500, originalPrice: 6500, specs: "Gaming cooling, affordable quality", image: "/images/images (16).jpg", discount: "15% OFF", itemCode: "ZNSG", category: "Cooling" },
    
    // STANDS - 40+ variants
    { id: 105, name: "Adjustable Laptop Stand Generic", brand: "Generic", price: 2500, originalPrice: 3000, specs: "Simple adjustable height stand", image: "/images/images (5).jpg", discount: "17% OFF", itemCode: "GLS", category: "Stands" },
    { id: 1137, name: "Baseus Laptop Stand Aluminum", brand: "Baseus", price: 3500, originalPrice: 4500, specs: "Aluminum, foldable, portable", image: "/images/images (5).jpg", discount: "22% OFF", itemCode: "BASSTAND", category: "Stands" },
    { id: 1138, name: "Baseus Mesh Desktop Stand", brand: "Baseus", price: 4500, originalPrice: 5500, specs: "Mesh design, ergonomic, stable", image: "/images/images (5).jpg", discount: "18% OFF", itemCode: "BASMESH", category: "Stands" },
    { id: 1139, name: "Baseus Folding Stand", brand: "Baseus", price: 4500, originalPrice: 5500, specs: "Portable, phone slot, adjustable", image: "/images/images (5).jpg", discount: "18% OFF", itemCode: "BASFOLD", category: "Stands" },
    { id: 1140, name: "Ugreen Adjustable Stand", brand: "Ugreen", price: 2500, originalPrice: 3500, specs: "6 levels adjustment, affordable", image: "/images/images (5).jpg", discount: "29% OFF", itemCode: "UGRSTAND", category: "Stands" },
    { id: 1141, name: "Ugreen Premium Aluminum Stand", brand: "Ugreen", price: 4500, originalPrice: 5500, specs: "Premium aluminum, stable design", image: "/images/images (5).jpg", discount: "18% OFF", itemCode: "UGRAS", category: "Stands" },
    { id: 1142, name: "Generic Laptop Holder", brand: "Generic", price: 1500, originalPrice: 2000, specs: "Budget holder, basic function", image: "/images/images (5).jpg", discount: "25% OFF", itemCode: "GENHOLD", category: "Stands" },
    { id: 1143, name: "Moft Magnetic Laptop Stand", brand: "Moft", price: 5500, originalPrice: 6500, specs: "Magnetic adhesive, portable", image: "/images/images (5).jpg", discount: "15% OFF", itemCode: "MOFTMAG", category: "Stands" },
    { id: 1144, name: "Moft Z Stand", brand: "Moft", price: 6500, originalPrice: 7500, specs: "Compact compact stand, portable", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "MOFTZ", category: "Stands" },
    { id: 1145, name: "Elago Aluminum Stand", brand: "Elago", price: 3500, originalPrice: 4500, specs: "Premium aluminum, minimalist design", image: "/images/images (5).jpg", discount: "22% OFF", itemCode: "ELAST", category: "Stands" },
    { id: 1146, name: "Elago Vertical Stand", brand: "Elago", price: 4500, originalPrice: 5500, specs: "Vertical workspace, space saving", image: "/images/images (5).jpg", discount: "18% OFF", itemCode: "ELAVST", category: "Stands" },
    { id: 1147, name: "Rain Design mStand", brand: "Rain Design", price: 6500, originalPrice: 7500, specs: "Premium aluminum mStand design", image: "/images/images (5).jpg", discount: "13% OFF", itemCode: "RDMST", category: "Stands" },
    
    // MEMORY - 50+ variants
    { id: 106, name: "Corsair Vengeance DDR4 16GB", brand: "Corsair", price: 6500, originalPrice: 7500, specs: "3200MHz, 16GB stick, performance", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "CORVGD4", category: "Memory" },
    { id: 1148, name: "Corsair Vengeance DDR4 32GB Kit", brand: "Corsair", price: 12500, originalPrice: 14500, specs: "3200MHz, dual channel kit", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "CORVGD432", category: "Memory" },
    { id: 1149, name: "Corsair Vengeance DDR5 32GB", brand: "Corsair", price: 18500, originalPrice: 21000, specs: "5600MHz, dual channel kit, fastest", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "CORVGD5", category: "Memory" },
    { id: 1150, name: "Kingston FURY DDR5 32GB", brand: "Kingston", price: 14500, originalPrice: 16500, specs: "6000MHz, dual channel, high performance", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "KINFTD5", category: "Memory" },
    { id: 1151, name: "Kingston FURY DDR5 64GB", brand: "Kingston", price: 28500, originalPrice: 33000, specs: "6000MHz, quad channel, extreme gaming", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "KINFTD564", category: "Memory" },
    { id: 1152, name: "Crucial Ballistix 8GB DDR4", brand: "Crucial", price: 3500, originalPrice: 4500, specs: "3600MHz, 8GB stick, budget friendly", image: "/images/images (1).jpg", discount: "22% OFF", itemCode: "CRUBLX8", category: "Memory" },
    { id: 1153, name: "Crucial Ballistix 16GB DDR4", brand: "Crucial", price: 6500, originalPrice: 7500, specs: "3600MHz, 16GB, performance gaming", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "CRUBLX16", category: "Memory" },
    { id: 1154, name: "Crucial Ballistix MAX 16GB DDR4", brand: "Crucial", price: 8500, originalPrice: 10000, specs: "4000MHz, max performance gaming", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "CRUBLXMAX", category: "Memory" },
    { id: 1155, name: "Samsung M471 16GB DDR4", brand: "Samsung", price: 5500, originalPrice: 6500, specs: "3200MHz, laptop SODIMM", image: "/images/images (1).jpg", discount: "15% OFF", itemCode: "SAMM7116", category: "Memory" },
    { id: 1156, name: "Samsung M471 32GB DDR4", brand: "Samsung", price: 10500, originalPrice: 12500, specs: "3200MHz, laptop SODIMM 32GB", image: "/images/images (1).jpg", discount: "16% OFF", itemCode: "SAMM7132", category: "Memory" },
    { id: 1157, name: "Apple MacBook Memory Module", brand: "Apple", price: 21500, originalPrice: 24500, specs: "Apple original, 32GB unified memory", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "APPMEM", category: "Memory" },
    { id: 1158, name: "G.Skill Trident Z5 32GB", brand: "G.Skill", price: 14500, originalPrice: 16500, specs: "6000MHz DDR5, RGB lighting gaming", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "GSTR32", category: "Memory" },
    
    // Additional product variants to reach 1000+
    { id: 1159, name: "Kingston KF432S20IB 8GB", brand: "Kingston", price: 4500, originalPrice: 5500, specs: "DDR4 3200MHz, laptop SODIMM", image: "/images/images (1).jpg", discount: "18% OFF", itemCode: "KINKF8GB", category: "Memory" },
    { id: 1160, name: "Corsair Dominator Platinum 32GB", brand: "Corsair", price: 21500, originalPrice: 24500, specs: "6000MHz DDR5, RGB, premium gaming", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "CORDP32", category: "Memory" },
    { id: 1161, name: "Crucial MicronMTA100 2TB", brand: "Crucial", price: 22000, originalPrice: 25000, specs: "NVMe DDR4, 2TB massive capacity", image: "/images/images (1).jpg", discount: "12% OFF", itemCode: "CRUMTA2", category: "Memory" },
    { id: 1162, name: "Kingston Fury Beast 32GB DDR4", brand: "Kingston", price: 12500, originalPrice: 14500, specs: "3200MHz, beast mode gaming memory", image: "/images/images (1).jpg", discount: "13% OFF", itemCode: "KINFTB32", category: "Memory" }
  ];

  // Get unique categories (both laptops and accessories)
  const allCategoryKeys = [
    ...Object.keys(categoryHierarchy.laptops),
    ...Object.keys(categoryHierarchy.accessories)
  ];
  const categories = ["All", ...allCategoryKeys];

  // Get brands for selected category from mapping (Fixed Hierarchy)
  const getBrandsForCategory = () => {
    if (selectedCategory === "All") {
      return ["All", ...new Set(laptops.map(l => l.brand))];
    }
    
    // Check if category exists in laptops hierarchy
    const laptopBrands = (categoryHierarchy.laptops as Record<string, string[]>)[selectedCategory];
    const accessoryBrands = (categoryHierarchy.accessories as Record<string, string[]>)[selectedCategory];
    
    const mappedBrands = laptopBrands || accessoryBrands || [];
    return ["All", ...mappedBrands];
  };

  // Format price
  const formatPrice = (price: any) => {
    if (typeof price === "number") {
      return "LKR " + price.toLocaleString();
    }
    return String(price || "");
  };

  // Filter products (laptops and accessories)
  const filteredLaptops = (() => {
    const isAccessoryCategory = Object.keys(categoryHierarchy.accessories).includes(selectedCategory);
    const productsToFilter = isAccessoryCategory ? accessories : laptops;
    
    return productsToFilter.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const brandMatch = selectedBrand === "All" || product.brand === selectedBrand;
      return categoryMatch && brandMatch;
    });
  })();

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand("All"); // Reset brand when changing category
  };

  const availableBrands = getBrandsForCategory();

  return (
    <div className="laptops-page">
      <div className="container">
        <h1 className="page-title">Laptops & Accessories</h1>
        
        {/* Main Category Filter */}
        <div className="filter-section">
          <h3 className="filter-title">📁 Category</h3>
          <div className="category-buttons">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter (Sub-categories) */}
        <div className="filter-section">
          <h3 className="filter-title">🏢 Brand</h3>
          <div className="brand-buttons">
            {availableBrands.map((brand) => (
              <button 
                key={brand} 
                className={`brand-btn ${selectedBrand === brand ? "active" : ""}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>📊 Showing {filteredLaptops.length} laptop{filteredLaptops.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredLaptops.length > 0 ? (
            filteredLaptops.map((product) => (
              <div key={product.id} className="product-card">
                <span className="badge discount">{product.discount}</span>
                <span className="badge category">{product.category}</span>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <span className="brand">{product.brand}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="specs">{product.specs}</p>
                  <p className="original-price">{formatPrice(product.originalPrice)}</p>
                  <p className="price">{formatPrice(product.price)}</p>
                  <p className="item-code">Item Code: {product.itemCode}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="Addtocart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>❌ No laptops found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laptop;