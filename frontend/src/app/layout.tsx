import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CustomerChatWidget } from '../components/chat/CustomerChatWidget';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Quantum Core | Sri Lanka's No. 1 Computer Marketplace",
  description: "High-end gaming laptops, custom PC builds, workstations, and computer accessories in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <Header />
            <main>{children}</main>
            <Footer />
            <CustomerChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
