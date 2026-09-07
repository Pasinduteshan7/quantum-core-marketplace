import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid-footer">
        <div>
          <h2 className="text-red-400 font-bold mb-2">Quantum Core</h2>
          <p>Your trusted partner for PC solutions, laptops, and accessories.</p>
        </div>

        <div>
          <h2 className="text-red-400 font-bold mb-2">Products</h2>
          <ul className="space-y-1">
            <li><Link href="/laptops">Laptops & Notebooks</Link></li>
            <li><Link href="/computers">Computers & Workstations</Link></li>
            <li><Link href="/laptops">Gaming Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-red-400 font-bold mb-2">Services</h2>
          <ul className="space-y-1">
            <li>Repair Services</li>
            <li>Installment Plans</li>
            <li>Payment Methods</li>
          </ul>
        </div>

        <div>
          <h2 className="text-red-400 font-bold mb-2">Contact</h2>
          <p className="mb-1">+94 714 576 576</p>
          <p>Online Store</p>
          <p>Colombo, Sri Lanka</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        © {new Date().getFullYear()} Quantum Core PC Solutions. All rights reserved.
      </div>
    </footer>
  );
};
