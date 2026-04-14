import React from 'react';
import { Link } from 'react-router';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const logo = new URL('../../assets/logo2.png', import.meta.url).href;

export function Footer() {
  return (
    <footer className="bg-[#2D160C] text-[#E0B58C] w-full pt-16 pb-8 border-t-4 border-[#4A2616]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col ml-3">
              <img src={logo} alt="Logo Amor & Cacau" className='w-20 '/>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed font-light tracking-wide max-w-sm">
            Trazendo doçura e momentos inesquecíveis para a sua vida com nossas receitas artesanais e ingredientes selecionados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-[#3E2116] flex items-center justify-center hover:bg-[#E0B58C] hover:text-[#2D160C] hover:scale-110 transition-all duration-300" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#3E2116] flex items-center justify-center hover:bg-[#E0B58C] hover:text-[#2D160C] hover:scale-110 transition-all duration-300" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold tracking-widest uppercase">Links Úteis</h4>
          <ul className="space-y-3 text-sm opacity-80 font-light tracking-wide">
            <li><a href="/sobre" className="hover:text-white transition-colors hover:underline underline-offset-4">Sobre Nós</a></li>
            <li><Link to="/cardapio" className="hover:text-white transition-colors hover:underline underline-offset-4">Nossos Produtos</Link></li>
            <li><a href="https://wa.me/5517992598131?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20encomenda%20para%20festa%20na%20Amor%20%26%20Cacau." target="_blank" rel="noreferrer" className="hover:text-white transition-colors hover:underline underline-offset-4">Encomendas para Festas</a></li>
            <li><Link to="/privacidade" className="hover:text-white transition-colors hover:underline underline-offset-4">Política de Privacidade</Link></li>
            <li><Link to="/termos-de-uso" className="hover:text-white transition-colors hover:underline underline-offset-4">Termos de Serviço</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold tracking-widest uppercase">Contato</h4>
          <ul className="space-y-4 text-sm opacity-80 font-light tracking-wide">
            <li className="flex items-start space-x-3 group">
              <MapPin size={18} className="mt-1 flex-shrink-0 text-[#E0B58C] group-hover:scale-110 transition-transform" />
              <span className="leading-relaxed">Rua do Cacau, 123 - Centro<br/>São Paulo, SP - 01234-567</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <Phone size={18} className="flex-shrink-0 text-[#E0B58C] group-hover:scale-110 transition-transform" />
              <span>+55 17 99259-8131</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <Mail size={18} className="flex-shrink-0 text-[#E0B58C] group-hover:scale-110 transition-transform" />
              <span>amorecacaurp@gmail.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold tracking-widest uppercase">Newsletter</h4>
          <p className="text-sm opacity-80 leading-relaxed font-light tracking-wide">
            Receba novidades e promoções exclusivas diretamente no seu e-mail.
          </p>
          <form className="flex flex-col space-y-3">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="bg-[#3E2116] border border-[#4A2616] rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E0B58C] transition-all"
            />
            <button 
              type="button" 
              className="bg-[#E0B58C] text-[#2D160C] font-bold uppercase tracking-widest text-sm py-3 rounded-md hover:bg-white hover:scale-[1.02] transition-all duration-300"
            >
              Assinar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3E2116] text-center text-xs opacity-60 font-light tracking-wider uppercase">
        <p>&copy; {new Date().getFullYear()} Amor & Cacau Confeitaria. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
