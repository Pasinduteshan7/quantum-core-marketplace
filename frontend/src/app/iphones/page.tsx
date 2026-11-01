'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { ShoppingCart, Check, Star, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface iPhoneProduct {
  id?: number | string;
  itemCode: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  specs?: string;
  image: string;
  images?: string[];
  description?: string;
  stock?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

// Fallback initial iPhone catalog
const FALLBACK_IPHONES: iPhoneProduct[] = [
  {
    itemCode: "IPH-16PM-256",
    name: "Apple iPhone 16 Pro Max 256GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 16 Series",
    price: 395990,
    originalPrice: 410000,
    discount: "3% OFF",
    specs: "6.9\" Super Retina XDR, Apple Intelligence, A18 Pro Chip, 48MP Fusion Camera, Titanium",
    image: "/images/iphone/apple-iphone-16-pro-max-256gb/01.png",
    images: [
      "/images/iphone/apple-iphone-16-pro-max-256gb/01.png",
      "/images/iphone/apple-iphone-16-pro-max-256gb/02.png",
      "/images/iphone/apple-iphone-16-pro-max-256gb/03.png",
      "/images/iphone/apple-iphone-16-pro-max-256gb/04.png"
    ],
    stock: 18,
    badge: "3% OFF",
    rating: 5.0,
    reviewCount: 64
  },
  {
    itemCode: "IPH-16P-128",
    name: "Apple iPhone 16 Pro 128GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 16 Series",
    price: 301990,
    originalPrice: 320900,
    discount: "6% OFF",
    specs: "6.3\" Super Retina XDR, Apple Intelligence, A18 Pro Chip, Camera Control, Titanium",
    image: "/images/iphone/apple-iphone-16-pro-128gb/01.png",
    images: [
      "/images/iphone/apple-iphone-16-pro-128gb/01.png",
      "/images/iphone/apple-iphone-16-pro-128gb/02.png",
      "/images/iphone/apple-iphone-16-pro-128gb/03.png",
      "/images/iphone/apple-iphone-16-pro-128gb/04.png",
      "/images/iphone/apple-iphone-16-pro-128gb/05.png"
    ],
    stock: 15,
    badge: "6% OFF",
    rating: 4.9,
    reviewCount: 45
  },
  {
    itemCode: "IPH-16-128",
    name: "Apple iPhone 16 128GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 16 Series",
    price: 259000,
    originalPrice: 269000,
    discount: "4% OFF",
    specs: "6.1\" Super Retina XDR, Apple Intelligence, A18 Chip, 48MP Fusion Camera, Action Button",
    image: "/images/iphone/apple-iphone-16-128gb/01.png",
    stock: 22,
    badge: "4% OFF",
    rating: 4.8,
    reviewCount: 52
  },
  {
    itemCode: "IPH-15PM-256",
    name: "Apple iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 15 Series",
    price: 339900,
    originalPrice: 354900,
    discount: "4% OFF",
    specs: "6.7\" Super Retina XDR, A17 Pro Chip, 5x Telephoto Zoom, Titanium Design, Action Button",
    image: "/images/iphone/apple-iphone-15-pro-max-256gb/01.jpg",
    stock: 15,
    badge: "4% OFF",
    rating: 4.9,
    reviewCount: 61
  },
  {
    itemCode: "IPH-15-128",
    name: "Apple iPhone 15 128GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 15 Series",
    price: 227500,
    originalPrice: 228900,
    discount: "1% OFF",
    specs: "6.1\" Super Retina XDR, A16 Bionic, 48MP Camera, Dynamic Island, USB-C",
    image: "/images/iphone/apple-iphone-15-128gb/01.png",
    stock: 24,
    badge: "1% OFF",
    rating: 4.8,
    reviewCount: 58
  },
  {
    itemCode: "IPH-14-128",
    name: "Apple iPhone 14 128GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 14 Series",
    price: 160900,
    originalPrice: 167000,
    discount: "4% OFF",
    specs: "6.1\" Super Retina XDR, A15 Bionic 5-core GPU, Crash Detection, Photonic Engine",
    image: "/images/iphone/iphone-14-128gb/01.jpg",
    stock: 13,
    badge: "4% OFF",
    rating: 4.8,
    reviewCount: 50
  },
  {
    itemCode: "IPH-13-128",
    name: "Apple iPhone 13 128GB",
    brand: "Apple",
    category: "Smartphones",
    subCategory: "iPhone 13 Series",
    price: 183900,
    originalPrice: 192900,
    discount: "5% OFF",
    specs: "6.1\" Super Retina XDR OLED, A15 Bionic, Cinematic Mode, Dual 12MP Cameras",
    image: "/images/iphone/apple-iphone-13-128-gb/01.jpg",
    stock: 12,
    badge: "5% OFF",
    rating: 4.8,
    reviewCount: 65
  },
  {
    itemCode: "APL-ACC-EARPODS",
    name: "Apple USB-C EarPods",
    brand: "Apple",
    category: "Accessories",
    subCategory: "Audio",
    price: 9900,
    originalPrice: 12900,
    discount: "23% OFF",
    specs: "Geometry of the Ear Design, Built-in Remote, High-Quality Audio, USB-C Connector",
    image: "/images/iphone/apple-usb-c-earpods/01.jpg",
    stock: 25,
    badge: "23% OFF",
    rating: 4.8,
    reviewCount: 42
  },
  {
    itemCode: "APL-ACC-20W",
    name: "Apple 20W USB-C Power Adapter",
    brand: "Apple",
    category: "Accessories",
    subCategory: "Chargers",
    price: 7900,
    originalPrice: 9990,
    discount: "21% OFF",
    specs: "20W Fast Charging, USB-C Port, Compact Design, Official Apple Accessory",
    image: "/images/iphone/apple-20w-usb-c-power-adapter-charger/01.webp",
    stock: 35,
    badge: "21% OFF",
    rating: 4.9,
    reviewCount: 56
  }
];

export default function IphonesPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<iPhoneProduct[]>(FALLBACK_IPHONES);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchIphones = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        const allItems = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        
        // Filter Apple products (Smartphones or Apple Accessories)
        const appleItems = allItems.filter((p: any) => 
          p.brand === 'Apple' || 
          p.category === 'Smartphones' || 
          (p.name && p.name.toLowerCase().includes('iphone')) ||
          (p.itemCode && (p.itemCode.startsWith('IPH-') || p.itemCode.startsWith('APL-')))
        );

        if (appleItems.length > 0) {
          setProducts(appleItems);
        }
      } catch (err) {
        console.warn('Backend unavailable, using fallback iPhone catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIphones();
  }, []);

  // Filter series options
  const seriesOptions = [
    { label: 'All Models', value: 'All' },
    { label: 'iPhone 16 Series', value: 'iPhone 16 Series' },
    { label: 'iPhone 15 Series', value: 'iPhone 15 Series' },
    { label: 'Pro & Pro Max', value: 'Pro' },
    { label: 'iPhone 14 / 13 / 12 / 11', value: 'Previous' },
    { label: 'Apple Accessories', value: 'Accessories' }
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedSeries === 'All') return true;
    if (selectedSeries === 'Accessories') return p.category === 'Accessories' || p.subCategory === 'Audio' || p.subCategory === 'Chargers';
    if (selectedSeries === 'Pro') return p.name.includes('Pro') || p.name.includes('Pro Max');
    if (selectedSeries === 'Previous') {
      return (
        p.name.includes('14') ||
        p.name.includes('13') ||
        p.name.includes('12') ||
        p.name.includes('11')
      );
    }
    return p.subCategory === selectedSeries || p.name.includes(selectedSeries.replace(' Series', ''));
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price_asc') return a.price - b.price;
    if (selectedSort === 'price_desc') return b.price - a.price;
    if (selectedSort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // featured default
  });

  const handleAddToCart = (product: iPhoneProduct) => {
    addToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.itemCode]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.itemCode]: false }));
    }, 1800);
  };

  const handleThumbnailSelect = (itemCode: string, imgPath: string) => {
    setActiveImages((prev) => ({ ...prev, [itemCode]: imgPath }));
  };

  const formatPrice = (price: number) => {
    return 'LKR ' + price.toLocaleString();
  };

  return (
    <div style={{ backgroundColor: '#0a0d14', color: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Premium Hero Spotlight */}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(24, 24, 38, 0.9) 0%, rgba(10, 13, 20, 1) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 24px 36px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '250px',
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '16px' }}>
          <Sparkles size={16} color="#60a5fa" />
          <span style={{ fontSize: '13px', letterSpacing: '0.05em', color: '#93c5fd', fontWeight: 600 }}>OFFICIAL APPLE PRODUCT CATALOG</span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          iPhone & Apple Ecosystem
        </h1>
        <p style={{ maxWidth: '680px', margin: '0 auto 24px auto', color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore the complete lineup of Apple iPhones from the groundbreaking iPhone 16 Pro Max to certified previous generations and genuine Apple accessories with warranty.
        </p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', color: '#cbd5e1', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>100% Genuine Apple Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#f59e0b" />
            <span>Islandwide Express Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} color="#ec4899" />
            <span>Best Market Price in Sri Lanka</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Filters & Sorting Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 20px',
            borderRadius: '16px',
            marginBottom: '32px'
          }}
        >
          {/* Series Selection Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {seriesOptions.map((opt) => {
              const active = selectedSeries === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedSeries(opt.value)}
                  style={{
                    background: active ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#ffffff' : '#94a3b8',
                    border: active ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            Showing <strong>{sortedProducts.length}</strong> Apple products
          </span>
          <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Synchronized with Quantum Core Inventory
          </span>
        </div>

        {/* Product Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {sortedProducts.map((p) => {
            const currentImg = activeImages[p.itemCode] || p.image;
            const isAdded = !!addedItems[p.itemCode];
            const hasMultipleImages = p.images && p.images.length > 1;

            return (
              <div
                key={p.itemCode}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Discount Badge */}
                {p.discount && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      zIndex: 2,
                      letterSpacing: '0.04em'
                    }}
                  >
                    {p.discount}
                  </span>
                )}

                {/* SubCategory Tag */}
                {p.subCategory && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(30, 41, 59, 0.85)',
                      color: '#94a3b8',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      zIndex: 2,
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {p.subCategory}
                  </span>
                )}

                {/* Product Image Stage */}
                <div
                  style={{
                    background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    padding: '24px 16px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '230px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <img
                    src={currentImg}
                    alt={p.name}
                    style={{
                      maxHeight: '190px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/images.jpg';
                    }}
                  />

                  {/* Multiple image gallery preview dots */}
                  {hasMultipleImages && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px', zIndex: 3 }}>
                      {p.images!.slice(0, 5).map((img, i) => (
                        <button
                          key={i}
                          onClick={() => handleThumbnailSelect(p.itemCode, img)}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: currentImg === img ? '#3b82f6' : 'rgba(255, 255, 255, 0.25)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.2s ease',
                            transform: currentImg === img ? 'scale(1.2)' : 'scale(1)'
                          }}
                          title={`View angle ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.06em' }}>
                        {p.brand.toUpperCase()}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>{p.rating || 4.8}</span>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>({p.reviewCount || 24})</span>
                      </div>
                    </div>

                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        margin: '0 0 8px 0',
                        color: '#f1f5f9',
                        lineHeight: 1.35,
                        minHeight: '40px'
                      }}
                    >
                      {p.name}
                    </h3>

                    {p.specs && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          margin: '0 0 14px 0',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '35px'
                        }}
                      >
                        {p.specs}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Price Block */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span style={{ fontSize: '12px', color: '#64748b', textDecoration: 'line-through' }}>
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={isAdded}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: isAdded ? '#10b981' : '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '11px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: isAdded ? 'default' : 'pointer',
                        transition: 'background-color 0.2s ease, transform 0.1s ease',
                        boxShadow: isAdded ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
