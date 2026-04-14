import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { LocationBar } from './LocationBar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { WhatsAppPopup } from './WhatsAppPopup';
import { TermsAcceptanceModal } from './TermsAcceptanceModal';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { CommentsProvider } from '../context/CommentsContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ProductsProvider } from '../context/ProductsContext';

export function Root() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ProductsProvider>
        <CommentsProvider>
          <FavoritesProvider>
            <CartProvider>
              <Toaster richColors position="top-center" closeButton />
              <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans relative">
                <Header />
                <LocationBar />
                <Outlet />
                {location.pathname !== '/contato' && <Footer />}
                <CartDrawer />
                <WhatsAppPopup />
                <TermsAcceptanceModal />
              </div>
            </CartProvider>
          </FavoritesProvider>
        </CommentsProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
