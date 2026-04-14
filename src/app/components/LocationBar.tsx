import React, { useState } from 'react';
import { MapPin, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export function LocationBar() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setError(true);
        setAddress(null);
      } else {
        setAddress(`${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-[#F0E6DD] py-2 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-center text-sm font-medium text-[#6B4E3E] max-w-lg truncate">
          <MapPin size={18} className="text-[#E0B58C] mr-2 flex-shrink-0" />
          {address ? (
             <span className="truncate flex items-center gap-2">
               Entregando em: <strong className="text-[#2D160C] truncate">{address}</strong>
               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
             </span>
          ) : (
             <span>Informe seu CEP para ver as opções de entrega</span>
          )}
        </div>

        <div className="relative flex items-center w-full sm:w-auto min-w-[260px]">
          <input
            type="text"
            value={cep}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
              }
              setCep(value.substring(0, 9));
              setError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite seu CEP..."
            className={`w-full pl-4 pr-12 py-2 bg-[#FAF6F0] border ${error ? 'border-red-400 focus:ring-red-400' : 'border-[#E0B58C]/50 focus:border-[#E0B58C] focus:ring-[#E0B58C]'} rounded-full text-sm font-medium tracking-wide text-[#2D160C] placeholder:text-[#8B7366]/60 focus:outline-none focus:ring-2 transition-all shadow-inner`}
          />
          
          <button
            onClick={handleSearch}
            disabled={loading || cep.length < 8}
            aria-label="Buscar CEP"
            className="absolute right-1 w-8 h-8 bg-[#2D160C] text-[#E0B58C] rounded-full flex items-center justify-center hover:bg-[#E0B58C] hover:text-[#2D160C] hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
            ) : (
              <ArrowRight size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
