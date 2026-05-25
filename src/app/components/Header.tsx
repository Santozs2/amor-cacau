import React from 'react';
import { ShoppingCart, ShoppingBag, User, Menu, Heart, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const logo = new URL('../../assets/logo.png', import.meta.url).href;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { items, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `relative pb-1 text-sm tracking-widest font-medium uppercase transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-[#E0B58C] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isActive ? 'text-white after:scale-x-100 after:origin-bottom-left' : 'text-[white] hover:text-[#E0B58C]'}`;
  };

  const getAnchorLinkClass = () => {
    return `relative pb-1 text-sm tracking-widest font-medium uppercase transition-colors text-[white] hover:text-[#E0B58C] after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-[#E0B58C] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-[#2D160C] text-[#E0B58C] sticky top-0 z-50 shadow-md border-b-[3px] border-[#4A2616]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        
        <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer">
          <img src={logo} alt="Logo da loja" className="h-50 w-50 object-contain" />
        </Link>

        <nav className="hidden md:flex space-x-10">
          <Link to="/" className={`${getNavLinkClass('/')} cursor-pointer`}>Inicio</Link>
          <Link to="/cardapio" className={`${getNavLinkClass('/cardapio')} cursor-pointer`}>Doces</Link>
          {isAdmin && (
            <Link to="/admin" className={`${getNavLinkClass('/admin')} cursor-pointer`}>Dashboard</Link>
          )}
          <Link to="/sobre" className={`${getNavLinkClass('/sobre')} cursor-pointer`}>Sobre</Link>
          <Link to="/contato" className={`${getNavLinkClass('/contato')} cursor-pointer`}>Contato</Link>
        </nav>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/favorites" className="relative text-[white] hover:text-[#E0B58C] transition-all hover:scale-110 transform cursor-pointer" aria-label="Favorites">
                <Heart size={26} strokeWidth={1.5} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-3 bg-[#E0B58C] text-[#2D160C] text-[10px] font-bold h-4 w-5 rounded-full flex items-center justify-center border border-[#2D160C]">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="text-[white] hover:text-[#E0B58C] transition-all hover:scale-110 transform flex items-center cursor-pointer" aria-label="User Menu">
                  <User size={26} strokeWidth={1.5} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 text-sm text-[#2D160C] border-b border-gray-200">
                    Olá, {user.user_metadata?.name || 'Usuário'}
                  </div>
                  <Link
                    to="/minhas-compras"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-[#2D160C] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Minhas Compras
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-[#2D160C] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/auth" className="text-[white] hover:text-[#E0B58C] transition-all hover:scale-110 transform cursor-pointer" aria-label="Login">
              <User size={26} strokeWidth={1.5} />
            </Link>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-[white] hover:text-[#E0B58C] transition-all hover:scale-110 transform flex items-center cursor-pointer" 
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={26} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-3 bg-[#E0B58C] text-[#2D160C] text-[10px] font-bold h-4 w-5 rounded-full flex items-center justify-center border border-[#2D160C]">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <div className="md:hidden ml-4 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-[#4A2616] focus:outline-none transition-colors cursor-pointer"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#3C1E0F] shadow-inner border-t border-[#4A2616]">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">Inicio</Link>
            <Link to="/cardapio" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">Doces</Link>
            <Link to="/sobre" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">Sobre</Link>
            <Link to="/contato" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">Contato</Link>
            {user && (
              <>
                <Link to="/minhas-compras" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">
                  Minhas Compras
                </Link>
                <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">
                  Favoritos ({favorites.length})
                </Link>
              </>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors"
              >
                Sair
              </button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#4A2616] hover:text-white transition-colors">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
