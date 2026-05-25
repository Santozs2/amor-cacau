import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Star, ShoppingCart, Send, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useComments, Comment } from '../context/CommentsContext';
import { toast } from 'sonner';
import { Product } from '../data/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

function ProductModalContent({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { comments, addComment, loadComments, loading: commentsLoading } = useComments();
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (isOpen && product) {
      loadComments(product.id.toString());
    }
  }, [isOpen, product, loadComments]);

  const handleFavoriteClick = useCallback(async () => {
    if (!user) {
      toast.error('Faça login para favoritar');
      return;
    }

    if (product) {
      await toggleFavorite(product);
    }
  }, [user, product, toggleFavorite]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !product) return;

    await addComment(product.id.toString(), newComment, newRating);
    setNewComment('');
    setNewRating(5);
  }, [newComment, user, product, newRating, addComment]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success('Produto adicionado ao carrinho!');
    onClose();
  }, [product, addToCart, onClose]);

  // Memoizar comentários exibidos
  const displayedComments = useMemo(() => {
    return comments.slice(0, 2);
  }, [comments]);

  // Memoizar dados do produtos
  const productData = useMemo(() => {
    if (!product) return null;
    return {
      formattedPrice: product.price.toFixed(2).replace('.', ','),
      isFav: isFavorite(product.id),
    };
  }, [product, isFavorite]);

  if (!isOpen || !product || !productData) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[90vh] overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.15)] ring-1 ring-[#E0B58C]/20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.95fr] animate-[fadeIn_0.35s_ease-out]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 rounded-full border border-white bg-white/90 p-2 text-[#2D160C] shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-[#E0B58C] hover:text-[#2D160C]"
          aria-label="Fechar modal"
        >
          <X size={22} />
        </button>

        <div className="relative h-80 lg:h-full overflow-hidden bg-[#FAF6F0]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xhdmV8ZW58MHx8fHwxNzc0NDY5MTYwfDA&ixlib=rb-4.1.0&q=80&w=400';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D160C]/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/80 bg-white/85 p-5 backdrop-blur-xl shadow-2xl text-[#2D160C]">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#E0B58C]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2D160C]">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-3xl font-serif font-extrabold leading-tight">{product.name}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B4E3E]">Uma experiência artesanal com sabor marcante, criada para quem ama doces de qualidade.</p>
          </div>
        </div>

        <div className="flex flex-col h-full min-h-0 bg-white">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#8B7366] mb-2">Detalhes</p>
                  <h2 className="text-3xl font-serif font-extrabold text-[#2D160C] leading-tight">{product.name}</h2>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  type="button"
                  disabled={!user}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 shadow-sm ${productData.isFav ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer' : 'bg-[#FAF6F0] text-[#2D160C] hover:bg-[#E0B58C] cursor-pointer'} ${!user ? 'cursor-not-allowed opacity-70 hover:bg-[#FAF6F0]' : ''}`}
                >
                  <Heart size={18} />
                  {productData.isFav ? 'Favorito' : 'Favoritar'}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-[#6B4E3E]">{product.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#F0E6DD] bg-[#FAF6F0] p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366] mb-3">Preço</p>
                  <p className="text-4xl font-extrabold text-[#2D160C] font-serif">R$ {productData.formattedPrice}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[#F0E6DD] bg-[#FAF6F0] p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366] mb-3">Refinado para você</p>
                  <ul className="space-y-2 text-sm text-[#6B4E3E] leading-relaxed">
                    <li>• Textura macia e artesanal</li>
                    <li>• Cobertura e recheio generosos</li>
                    <li>• Feito para presentear e celebrar</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#6B4E3E]">
                <Star size={18} className="text-[#E0B58C]" />
                <p className="text-sm font-semibold uppercase tracking-[0.35em]">Avaliações</p>
              </div>

              <div className="grid gap-4">
                {commentsLoading ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#6B4E3E]">Carregando comentários...</p>
                  </div>
                ) : displayedComments.map((comment: Comment) => (
                  <div key={comment.id} className="rounded-[1.5rem] border border-[#F0E6DD] bg-[#FAF6F0] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-[#2D160C]">{comment.user_name}</span>
                      <div className="flex items-center gap-1 text-[#D4A373]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < comment.rating ? 'currentColor' : 'none'} strokeWidth={i < comment.rating ? 0 : 2} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#6B4E3E] leading-relaxed">"{comment.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {user ? (
              <form onSubmit={handleAddComment} className="rounded-[1.5rem] border border-[#F0E6DD] bg-[#FAF6F0] p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#2D160C] mb-4">Compartilhe sua experiência</p>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="transition-transform hover:-translate-y-1"
                      >
                        <Star
                          size={18}
                          fill={star <= newRating ? '#D4A373' : 'none'}
                          strokeWidth={star <= newRating ? 0 : 2}
                          className={star <= newRating ? 'text-[#D4A373]' : 'text-[#8B7366]'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Comentário..."
                    className="min-h-[100px] rounded-[1.5rem] border border-[#E0D8C8] bg-white px-4 py-3 text-sm text-[#2D160C] outline-none focus:border-[#E0B58C] focus:ring-2 focus:ring-[#E0B58C]/40"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#2D160C] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E0B58C] hover:text-[#2D160C] shadow-lg"
                    >
                      <Send size={16} />
                      Enviar avaliação
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-[1.5rem] border border-[#F0E6DD] bg-[#FAF6F0] p-5 shadow-sm text-center">
                <p className="text-sm text-[#6B4E3E] mb-4">Faça login para deixar sua avaliação</p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 bg-[#2D160C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 text-sm"
                >
                  Fazer Login
                </Link>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 border-t border-[#F0E6DD] bg-white/95 backdrop-blur-xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366] mb-1">Preço</p>
                <p className="text-3xl font-extrabold text-[#2D160C] font-serif">R$ {productData.formattedPrice}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFavoriteClick}
                  type="button"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${productData.isFav ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#FAF6F0] text-[#2D160C] hover:bg-[#E0B58C] hover:text-white'}`}
                >
                  <Heart size={20} />
                </button>
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2D160C] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E0B58C] hover:text-[#2D160C] shadow-lg"
                >
                  <ShoppingCart size={18} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with React.memo to prevent unnecessary re-renders
export const ProductModal = React.memo(ProductModalContent);
