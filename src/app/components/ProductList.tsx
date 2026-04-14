import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, Star, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { ProductModal } from './ProductModal';
import { toast } from 'sonner';
import type { Product } from '../data/products';
import { useProducts } from '../context/ProductsContext';

const categories = ['Todos', 'Doces', 'Bolos', 'Tortas', 'Especiais'];

const ProductCard = React.memo(({ product, onSelect, onAddToCart, onToggleFavorite, isFavorite: isFav }: {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (e: React.MouseEvent, product: Product) => Promise<void>;
  isFavorite: boolean;
}) => (
  <div 
    onClick={() => onSelect(product)}
    className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#F0E6DD] cursor-pointer transform hover:-translate-y-2"
  >
    <div className="relative aspect-square overflow-hidden bg-[#FAF6F0]">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xhdmV8ZW58MHx8fHwxNzc0NDY5MTYwfDA&ixlib=rb-4.1.0&q=80&w=400';
        }}
      />
      
      <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
        {product.tags.map((tag, idx) => (
          <span key={idx} className="bg-[#E0B58C]/90 text-[#2D160C] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <button
          onClick={(e) => onToggleFavorite(e, product)}
          className={`w-10 h-10 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isFav
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/90 text-[#2D160C] hover:bg-white hover:scale-110'
          }`}
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            size={18}
            className={isFav ? 'fill-current' : ''}
          />
        </button>
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-0" />
    </div>

    <div className="flex flex-col flex-grow p-6 space-y-4">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center space-x-1 text-[#D4A373]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating) ? 0 : 2} />
          ))}
          <span className="text-[#6B4E3E] text-xs font-semibold ml-2">({product.rating})</span>
        </div>
        <h3 className="text-[#2D160C] font-bold text-lg leading-tight line-clamp-1 group-hover:text-[#8D5D44] transition-colors">
          {product.name}
        </h3>
      </div>
      
      <p className="text-[#8B7366] text-sm line-clamp-2 leading-relaxed opacity-80 flex-grow">
        {product.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[#F0E6DD]">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#8B7366] uppercase tracking-wider mb-0.5">Por Apenas</span>
          <span className="text-2xl font-extrabold text-[#2D160C] tracking-tight font-serif">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          aria-label="Adicionar ao carrinho"
          className="bg-[#2D160C] text-white p-3.5 rounded-full hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 hover:scale-110 active:scale-95 shadow-md z-20 cursor-pointer flex items-center justify-center"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

export function ProductList() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleFavoriteClick = useCallback(async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    await toggleFavorite(product);
  }, [toggleFavorite]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success('Produto adicionado ao carrinho!');
  }, [addToCart]);

  // Memoizar produtos filtrados para evitar recálculos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section className="w-full pb-20">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
        <span className="text-[#E0B58C] font-bold tracking-widest uppercase text-xs">Menu</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif">
          Nossos Produtos
        </h2>
        <div className="h-1 w-24 bg-[#E0B58C] rounded-full mt-2"></div>
        <p className="text-[#6B4E3E] max-w-2xl text-lg font-medium tracking-wide">
          Explore nossa seleção completa de doces, bolos e sobremesas, tudo feito com amor e ingredientes premium.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#F0E6DD]">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === category ? 'bg-[#2D160C] text-[#E0B58C] shadow-md' : 'bg-[#FAF6F0] text-[#6B4E3E] hover:bg-[#E0B58C] hover:text-[#2D160C] cursor-pointer'}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#FAF6F0] border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all text-[#2D160C] placeholder:text-[#8B7366]"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7366]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleFavoriteClick}
            isFavorite={isFavorite(product.id)}
          />
        )) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-[#FAF6F0] rounded-full flex items-center justify-center mb-4 text-[#8B7366]">
               <Search size={32} />
             </div>
             <h3 className="text-2xl font-bold text-[#2D160C] font-serif mb-2">Nenhum produto encontrado</h3>
             <p className="text-[#6B4E3E]">Tente buscar por um termo diferente ou limpe os filtros.</p>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </section>
  );
}
