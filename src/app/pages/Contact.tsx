import React from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <section className="w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-14">
          <span className="text-[#E0B58C] font-bold tracking-widest uppercase text-xs">Fale Conosco</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif">
            Entre em Contato
          </h1>
          <div className="h-1 w-24 bg-[#E0B58C] rounded-full mt-2"></div>
          <p className="text-[#6B4E3E] max-w-2xl text-base font-medium tracking-wide">
            Dúvidas, encomendas especiais ou apenas querendo dizer um "olá"? A AMOR & CACAU está pronta para atender você.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#F0E6DD]">
          
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#2D160C] mb-6">Informações da Loja</h3>
              
              <div className="mb-8 rounded-2xl overflow-hidden border border-[#E0D8C5] shadow-sm">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1970220641154!2d-46.63665792466986!3d-23.54131587881335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5853b0e15967%3A0x6d9f8c0e687b3a4a!2zUHJhw6dhIGRhIFPDqSAtIFPDqSwgU8OjbyBQYXVsbyAtIFNQLCBCcmF6aWw!5e0!3m2!1sen!2sus!4v1712760000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="200" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da Loja"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#4A2616] flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D160C] text-sm uppercase tracking-wider mb-1">Endereço</h4>
                    <p className="text-[#6B4E3E] text-sm leading-relaxed">
                      Rua do Cacau, 123 - Térreo<br />
                      Centro, São Paulo - SP<br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#4A2616] flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D160C] text-sm uppercase tracking-wider mb-1">Telefone & WhatsApp</h4>
                    <p className="text-[#6B4E3E] text-sm leading-relaxed">
                      (11) 98765-4321<br />
                      (11) 3456-7890
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#4A2616] flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D160C] text-sm uppercase tracking-wider mb-1">Horário de Funcionamento</h4>
                    <p className="text-[#6B4E3E] text-sm leading-relaxed">
                      Segunda a Sexta: 08:00 às 19:00<br />
                      Sábados e Feriados: 09:00 às 16:00<br />
                      <span className="text-[#E0B58C] font-bold">Domingos: Fechado</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#E0B58C]/30">
               <h4 className="font-bold text-[#2D160C] mb-2 font-serif flex items-center gap-2">
                 <Mail size={18} className="text-[#E0B58C]" />
                 Encomendas Corporativas
               </h4>
               <p className="text-sm text-[#6B4E3E] leading-relaxed mb-4">
                 Preparamos mesas de doces e lembrancinhas personalizadas para o seu evento.
               </p>
               <a href="mailto:amorecacaurp@gmail.com" className="text-sm font-bold text-[#2D160C] underline underline-offset-4 hover:text-[#E0B58C] transition-colors">
                 amorecacaurp@gmail.com
               </a>
            </div>
          </div>

          <div className="bg-[#FAF6F0]/50 p-8 rounded-2xl border border-[#F0E6DD]">
            <h3 className="text-2xl font-serif font-bold text-[#2D160C] mb-6">Mande uma Mensagem</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1">Nome</label>
                  <input 
                    type="text" 
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 bg-white border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1">E-mail</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-white border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1">Assunto</label>
                <select className="w-full px-4 py-3 bg-white border border-[#F0E6DD] rounded-xl text-sm text-[#6B4E3E] focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all appearance-none">
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida Geral</option>
                  <option value="encomenda">Encomenda</option>
                  <option value="feedback">Feedback/Sugestão</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1">Mensagem</label>
                <textarea 
                  rows={4}
                  placeholder="Como podemos te ajudar hoje?"
                  className="w-full px-4 py-3 bg-white border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2D160C] text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 shadow-md flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D160C] cursor-pointer active:scale-95"
              >
                <span>Enviar Mensagem</span>
                <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
