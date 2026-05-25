import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from './AuthContext';
import { toast } from 'sonner';
import { products as staticProducts } from '../data/products';

export interface Product {
  id: string | number;
  name: string;
  category?: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string | number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string | number) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;
      
      if (data) {
        setProducts(prev => [data[0] as Product, ...prev]);
        toast.success('Produto adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Falha ao adicionar:', error);
      toast.error('Erro ao salvar produto online.');
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string | number, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data[0] } : p));
        toast.success('Produto atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Falha ao atualizar:', error);
      toast.error('Erro ao atualizar produto.');
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produto removido com sucesso!');
    } catch (error) {
      console.error('Falha ao remover:', error);
      toast.error('Erro ao remover produto.');
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ products, loading, addProduct, updateProduct, deleteProduct, refreshProducts: fetchProducts }),
    [products, loading, addProduct, updateProduct, deleteProduct, fetchProducts]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
