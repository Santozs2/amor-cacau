import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function Hero() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-105"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1768326119181-5f3cfe0adb4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hvY29sYXRlJTIwY2FrZXxlbnwxfHx8fDE3NzQ0NjkwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080")',
          backgroundPosition: 'center 40%'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#2D160C]/90 via-[#2D160C]/50 to-transparent flex items-end">
        <div className="w-full h-full bg-black/20" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 text-white z-10 space-y-6">
        <div className="inline-block px-4 py-1 rounded-full bg-[#E0B58C] text-[#2D160C] font-bold text-xs uppercase tracking-widest max-w-fit mb-2">
          Novidades da Estação
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-3xl drop-shadow-md font-serif">
          Descubra o sabor da verdadeira confeitaria
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-2xl opacity-90 drop-shadow flex flex-col space-y-2 pb-4">
          <span className="font-light italic">"Uma experiência doce e inesquecível em cada mordida."</span>
        </p>

        <Link to="/cardapio" className="bg-[#E0B58C] text-[#2D160C] hover:bg-white hover:text-[#4A2616] transition-all duration-300 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center space-x-3 w-max group/btn shadow-lg hover:shadow-xl hover:-translate-y-1">
          <span>Ver Cardápio Completo</span>
          <ArrowRight size={18} strokeWidth={2.5} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
