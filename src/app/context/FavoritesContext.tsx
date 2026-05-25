import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import type { Product } from '../data/products';
import { useProducts } from './ProductsContext';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string | number) => void;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string | number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'bakery_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { products: allProducts, loading: productsLoading } = useProducts();

  // Carregar favoritos apenas uma vez quando o app inicia
  useEffect(() => {
    if (initialized || productsLoading) return;
    
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favoriteIds: string[] = JSON.parse(stored);
        const favoriteProducts = favoriteIds
          .map(id => allProducts.find(prod => prod.id.toString() === id))
          .filter((product): product is Product => Boolean(product));
        setFavorites(favoriteProducts);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized, productsLoading, allProducts]);

  // Salvar favoritos quando mudam (mas não no primeiro load)
  useEffect(() => {
    if (!loading && initialized) {
      try {
        const favoriteIds = favorites.map(product => product.id.toString());
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, loading, initialized]);

  const isFavorite = useCallback((productId: string | number): boolean => {
    return favorites.some(product => product.id.toString() === productId.toString());
  }, [favorites]);

  const addToFavorites = useCallback((product: Product) => {
    if (!user) {
      toast.error('Faça login para adicionar aos favoritos');
      return;
    }

    if (isFavorite(product.id)) {
      return;
    }

    setFavorites(prev => [...prev, product]);
    toast.success('Produto adicionado aos favoritos!');
  }, [user, isFavorite]);

  const removeFromFavorites = useCallback((productId: string | number) => {
    const normalizedId = productId.toString();
    setFavorites(prev => prev.filter(product => product.id.toString() !== normalizedId));
    toast.success('Produto removido dos favoritos');
  }, []);

  const toggleFavorite = useCallback(async (product: Product) => {
    if (!user) {
      toast.error('Faça login para adicionar aos favoritos');
      return;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      return;
    }

    addToFavorites(product);
  }, [user, isFavorite, removeFromFavorites, addToFavorites]);

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      loading,
    }),
    [favorites, addToFavorites, removeFromFavorites, toggleFavorite, isFavorite, loading]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}