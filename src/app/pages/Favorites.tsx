import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import type { Product } from '../data/products';

export function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success('Produto adicionado ao carrinho!');
  };

  const handleRemoveFromFavorites = (productId: string | number) => {
    removeFromFavorites(productId);
  };

  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-[#E0B58C]" fill="currentColor" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2D160C] tracking-tight font-serif">
            Meus Favoritos
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="text-[#E0B58C] mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold text-[#2D160C] mb-4">
              Nenhum favorito ainda
            </h2>
            <p className="text-[#6B4E3E] mb-8 max-w-md mx-auto">
              Explore nossos produtos e clique no coração para adicionar aos seus favoritos.
            </p>
            <Link
              to="/cardapio"
              className="inline-flex items-center gap-2 bg-[#2D160C] text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg border border-[#F0E6DD] overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-md cursor-pointer"
                    aria-label="Remover dos favoritos"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#2D160C] mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[#6B4E3E] text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#2D160C]">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 bg-[#2D160C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}