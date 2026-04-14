import React from 'react';
import imagem from '../../assets/Alice.png';
export function About() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <section className="w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-14">
          <span className="text-[#E0B58C] font-bold tracking-widest uppercase text-xs">Sobre Nós</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif">
            Nossa História
          </h1>
          <div className="h-1 w-24 bg-[#E0B58C] rounded-full mt-2"></div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-[#F0E6DD] flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-[#E0B58C] rounded-[3rem] transform rotate-3 scale-105 opacity-20"></div>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src={imagem} 
                alt="Dona da Confeitaria Amor & Cacau" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/20">
                <p className="font-serif text-xl font-bold text-[#2D160C]">Chef Alice</p>
                <p className="text-sm font-medium text-[#8B7366] uppercase tracking-wider mt-1">Fundadora e Mestre Confeiteira</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif mt-3 mb-6">
                A paixão por trás da AMOR & CACAU
              </h2>
            </div>
            
            <div className="space-y-6 text-[#6B4E3E] text-lg leading-relaxed font-medium">
              <p>
                Tudo começou na pequena cozinha da minha avó, onde o aroma de baunilha e chocolate derretido preenchia o ar todas as tardes. A confeitaria nunca foi apenas sobre misturar ingredientes, mas sobre criar momentos inesquecíveis.
              </p>
              <p>
                Em 2018, decidi transformar essa paixão em realidade e fundei a <strong className="text-[#2D160C]">AMOR & CACAU</strong>. Nosso compromisso é trazer aquele sentimento acolhedor de receita de família, elevado pelo rigor técnico da alta confeitaria e pelos ingredientes mais finos.
              </p>
              <p>
                Cada doce que sai da nossa vitrine carrega um pedacinho da nossa dedicação. Estamos muito felizes em poder adoçar a sua vida.
              </p>
            </div>

            <div className="pt-6 flex gap-4">
              <div className="text-center px-6 py-4 bg-[#FAF6F0] rounded-2xl border border-[#F0E6DD]">
                <span className="block text-3xl font-black font-serif text-[#2D160C] mb-1">+5k</span>
                <span className="text-xs font-bold text-[#8B7366] uppercase tracking-wider">Clientes Felizes</span>
              </div>
              <div className="text-center px-6 py-4 bg-[#FAF6F0] rounded-2xl border border-[#F0E6DD]">
                <span className="block text-3xl font-black font-serif text-[#2D160C] mb-1">100%</span>
                <span className="text-xs font-bold text-[#8B7366] uppercase tracking-wider">Artesanal</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
