import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FileText, X } from 'lucide-react';

export function TermsAcceptanceModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('termsAccepted');
    
    if (!hasAcceptedTerms) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="bg-[#2D160C] text-[#E0B58C] p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={28} />
            <h2 className="text-2xl font-bold font-serif">Termos de Uso</h2>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-[#3E2116] p-1 rounded transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[#2D160C] mb-4 leading-relaxed">
            Bem-vindo ao <strong>Amor & Cacau</strong>! Para continuar utilizando nossos serviços, pedimos que você aceite nossos termos de uso e política de privacidade.
          </p>
          
          <div className="bg-[#FAF6F0] border border-[#F0E6DD] rounded-lg p-4 mb-6">
            <ul className="text-sm text-[#6B4E3E] space-y-2">
              <li>✓ Proteção de seus dados pessoais</li>
              <li>✓ Termos claros de transações</li>
              <li>✓ Direitos do consumidor garantidos</li>
              <li>✓ Política de entrega e reembolso</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link
              to="/termos-de-uso"
              onClick={handleClose}
              className="flex-1 bg-[#2D160C] text-[#E0B58C] hover:bg-[#3E2116] px-4 py-3 rounded-lg font-semibold text-center transition-colors cursor-pointer"
            >
              Ler Completo
            </Link>
            <button
              onClick={handleAccept}
              className="flex-1 bg-[#E0B58C] text-[#2D160C] hover:bg-[#D4A574] px-4 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Aceitar
            </button>
          </div>

          <p className="text-xs text-[#999] mt-4 text-center">
            Você pode ler nossa{' '}
            <Link to="/privacidade" className="text-[#E0B58C] hover:underline">
              Política de Privacidade
            </Link>{' '}
            a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
