import type { Metadata } from "next";
import { Karla } from "next/font/google";
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Navbar from '@/components/layout/navBar';
import Footer from '@/components/layout/footer';
import Logo from './logoSinLetras.png';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart';
import SidebarCart from '@/components/cart/sidebar-cart';

import AccessibilityWidget from '@/components/ui/accessibility-widget';

const inter = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZA - Tienda Online",
  description: "Lo mejor en un solo lugar",
  icons: {
    icon: Logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <SidebarCart />
            <main>
              {children}
            </main>
            <Footer />
            <AccessibilityWidget />
          </CartProvider>
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}