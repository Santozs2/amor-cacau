import React, { useState } from 'react';
import { X } from 'lucide-react';

// Logo oficial do WhatsApp (simplificada)
const WhatsAppLogo = () => (
  <svg
    viewBox="0 0 448 512"
    fill="currentColor"
    className="w-6 h-6 text-white"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z" />
  </svg>
);

export function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const phone = '5517992598131';
  const text = encodeURIComponent('Olá! Gostaria de fazer uma encomenda na Amor & Cacau.');
  const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[320px] rounded-3xl border border-[#E0B58C] bg-white/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]">
                <WhatsAppLogo />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.3em] text-[#E0B58C] font-bold">Atendimento</span>
                <h3 className="text-lg font-semibold text-[#2D160C]">WhatsApp</h3>
              </div>
            </div>  
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E0B58C] text-[#2D160C] transition hover:bg-[#E0B58C]/10 hover:text-[#2D160C] focus:outline-none focus:ring-2 focus:ring-[#E0B58C] cursor-pointer"
              aria-label="Fechar popup WhatsApp"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#6B4E3E]">
            Tire suas dúvidas, peça um orçamento ou encomende doces especiais por mensagem instantânea.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition hover:bg-[#1ebe5a] hover:shadow-[#1ebe5a]/30"
          >
            <WhatsAppLogo />
            Abrir WhatsApp
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition hover:scale-105 hover:bg-[#1ebe5a] focus:outline-none focus:ring-2 focus:ring-[#E0B58C] cursor-pointer"
        aria-label={open ? 'Fechar chat WhatsApp' : 'Abrir chat WhatsApp'}
      >
        <WhatsAppLogo />
      </button>
    </div>
  );
}
