'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { MessageSquare } from 'lucide-react';

const Button = ({ children, className = '', ...rest }: any) => (
  <button className={`btn ${className}`} {...rest}>{children}</button>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`card ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }: any) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();
  const [liveLatest, setLiveLatest] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/products');
        if (res.data && res.data.length > 0) {
          setLiveLatest(res.data.slice(0, 8));
        }
      } catch (err) {
        console.warn('Backend unavailable, using fallback latest products');
      }
    };
    fetchLatest();
  }, []);

  const heroSlides = [
    { image: '/images/GAMING LAPTOPS.png' },
    { image: '/images/Screenshot 2025-06-28 191054 copy.png' },
    { image: '/images/Screenshot 2025-06-28 191116 copy.png' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const productCategories = [
    { image: '/images/Screenshot 2025-06-27 000153.png', link: '/laptops' },
    { image: '/images/LAPTOP ACCESORIES copy.png', link: '/laptops' },
    { image: '/images/DESKTOP AND ACCESORIES copy.png', link: '/computers' },
    { image: '/images/WORKSTATION AND GAMING DESKTOP.png', link: '/computers' },
    { image: '/images/UPS AND NETWORK ITEM.png', link: '/computers' },
    { image: '/images/USED LAPTOPS COMPUTERS.png', link: '/computers' },
    { image: '/images/SOFTWARES.png', link: '/computers' }
  ];

  const latestProducts = [
    {
      id: 1,
      name: 'MSI Raider GE78 HX',
      brand: 'MSI',
      price: 'LKR 1,828,200',
      originalPrice: 'LKR 2,050,000',
      specs: 'Intel i9-13980HX, 32GB DDR5, RTX 4090',
      image: '/images/images.jpg',
      itemCode: 'BC0920',
      discount: '11% OFF',
      badge: 'PRE ORDER'
    },
    {
      id: 2,
      name: 'MSI Raider GE68 HX',
      brand: 'MSI',
      price: 'LKR 1,966,800',
      originalPrice: 'LKR 2,200,000',
      specs: 'Intel i9-13950HX, 32GB DDR5, RTX 4080',
      image: '/images/blk_sitewide_400x400.webp',
      itemCode: 'BNE230',
      discount: '11% OFF',
      badge: 'PRE ORDER'
    },
    {
      id: 3,
      name: 'MSI Titan 18 HX',
      brand: 'MSI',
      price: 'LKR 2,557,500',
      originalPrice: 'LKR 2,850,000',
      specs: 'Intel i9-14900HX, 64GB DDR5, RTX 4090',
      image: '/images/images.jpg',
      itemCode: 'BLA852',
      discount: '10% OFF',
      badge: 'PRE ORDER'
    },
    {
      id: 4,
      name: 'MSI Titan 18 HX AI',
      brand: 'MSI',
      price: 'LKR 2,183,500',
      originalPrice: 'LKR 2,450,000',
      specs: 'Intel i9-14900HX, 32GB DDR5, RTX 4080',
      image: '/images/blk_sitewide_400x400.webp',
      itemCode: 'BLA2289',
      discount: '11% OFF',
      badge: 'PRE ORDER'
    },
    {
      id: 5,
      name: 'ASUS ROG Strix G18',
      brand: 'ASUS ROG',
      price: 'LKR 1,750,000',
      originalPrice: 'LKR 1,950,000',
      specs: 'Intel i9-13980HX, 32GB DDR5, RTX 4070 Ti',
      image: '/images/blk_sitewide_400x400.webp',
      itemCode: 'ROG180',
      discount: '10% OFF',
      badge: 'NEW'
    }
  ];

  const formatPrice = (price: any) => {
    if (typeof price === 'number') {
      return 'LKR ' + price.toLocaleString();
    }
    return String(price || '');
  };

  const displayProducts = liveLatest.length > 0 ? liveLatest : latestProducts;

  return (
    <div className="home-root">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className="carousel-slide"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="carousel-overlay"></div>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
        <button className="carousel-arrow left" onClick={prevSlide}>‹</button>
        <button className="carousel-arrow right" onClick={nextSlide}>›</button>
      </section>

      {/* Brand Section */}
      <section className="brands-section">
        <div className="brands-heading">
          <h2>SRI LANKA&apos;S NO 1 COMPUTER</h2>
          <h2>MARKETPLACE</h2>
        </div>
        <div className="brands-logos">
          <img src="/images/MSI.png" alt="MSI" />
          <img src="/images/image copy copy copy copy copy.png" alt="Apple" />
          <img src="/images/SAMSUNG.png" alt="Samsung" />
          <img src="/images/HP.png" alt="HP" />
          <img src="/images/LENOVO.png" alt="Lenovo" />
          <img src="/images/ASUS.png" alt="ASUS" />
          <img src="/images/ACER.png" alt="Acer" />
        </div>
      </section>

      {/* Product Categories */}
      <section className="categories-section">
        <div className="categories-grid">
          {productCategories.map((cat, i) => (
            <Link href={cat.link} key={i} className="category-link">
              <Card>
                <CardContent>
                  <img src={cat.image} alt="category" className="category-img" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="products-section">
        <div className="products-head">
          <h2>LATEST PRODUCTS</h2>
          <p>BEST - LOWEST PRICE FOR ALL PRODUCTS</p>
        </div>
        <div className="products-grid">
          {displayProducts.map((p) => (
            <Card key={p.id} className="product-card">
              <CardContent>
                <img src={p.image} alt={p.name} className="product-img" />
                <div className="product-info">
                  <span className="product-brand">{p.brand}</span>
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-specs">{p.specs}</p>
                  {p.originalPrice && <span className="product-old">{formatPrice(p.originalPrice)}</span>}
                  <span className="product-new">{formatPrice(p.price)}</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button
                      onClick={() => addToCart(p)}
                      className="Addtocart-btn"
                      style={{ flex: 1, marginTop: 0, borderRadius: '4px' }}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('open-store-chat', { detail: p }));
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px 12px',
                        background: '#0f172a',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Ask store owner about this product"
                    >
                      <MessageSquare size={14} />
                      <span>Ask</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="products-footer">
          <Link href="/laptops" className="products-viewall">
            View More Gaming Laptops
          </Link>
        </div>
      </section>

      {/* Bottom Info Section */}
      <section className="bottom-section">
        <h2>Why Choose Quantum Core?</h2>
        <div className="bottom-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">🚚</span>
            <h3>Island-wide Delivery</h3>
            <p>Fast and secure delivery across Sri Lanka</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💳</span>
            <h3>Flexible Payment</h3>
            <p>Multiple payment options including installments</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🛠️</span>
            <h3>Expert Support</h3>
            <p>Professional technical support and service</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🛡️</span>
            <h3>Quality Guarantee</h3>
            <p>Only genuine products with warranty</p>
          </div>
        </div>
      </section>
    </div>
  );
}
