import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PurchaseConfirmationModalProps {
  orderData: {
    items: any[];
    total_amount: number;
    shipping_cost: number;
    address: Address;
    payment_method: string;
  };
  onClose: () => void;
}

export function PurchaseConfirmationModal({ orderData, onClose }: PurchaseConfirmationModalProps) {
  const [address, setAddress] = useState<Address>(orderData.address);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const fetchAddressFromCep = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingAddress(true);
    setCepError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }

      setAddress(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
        zipCode: cep,
      }));

      toast.success('Endereço preenchido automaticamente');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCepError('Erro ao buscar endereço');
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  const handleCepChange = (value: string) => {
    let formattedCep = value.replace(/\D/g, '');
    if (formattedCep.length > 5) {
      formattedCep = formattedCep.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setAddress(prev => ({ ...prev, zipCode: formattedCep }));

    // Debounce CEP fetch
    const timeoutId = setTimeout(() => {
      if (formattedCep.replace(/\D/g, '').length === 8) {
        fetchAddressFromCep(formattedCep);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E0D8C5]">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={28} />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Pedido Confirmado</p>
              <h2 className="mt-1 text-2xl font-serif font-extrabold text-[#2D160C]">Compra Realizada!</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#FAF6F0] transition-all duration-300 text-[#2D160C] cursor-pointer"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Produtos Comprados */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-[#2D160C] mb-4 flex items-center gap-2">
              <Truck size={20} className="text-[#E0B58C]" />
              Produtos do Pedido
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-3 border border-[#F0E6DD]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2D160C]">{item.name}</h4>
                    <p className="text-sm text-[#6B4E3E]">Quantidade: {item.quantity}</p>
                    <p className="text-sm font-medium text-[#E0B58C]">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Endereço de Entrega */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#E0B58C]" />
              <h3 className="text-lg font-semibold text-[#2D160C]">Endereço de Entrega</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm pr-10"
                    placeholder="01234-567"
                    maxLength={9}
                  />
                  {isLoadingAddress && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-[#E0B58C]" />
                  )}
                </div>
                {cepError && <p className="text-xs text-red-600 mt-1">{cepError}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Rua</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Número</label>
                <input
                  type="text"
                  value={address.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Complemento</label>
                <input
                  type="text"
                  value={address.complement}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="Apto 45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Bairro</label>
                <input
                  type="text"
                  value={address.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Cidade</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Estado</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          </section>

          {/* Resumo */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-[#2D160C] mb-4">Resumo do Pedido</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B4E3E]">Subtotal</span>
                <span className="font-medium text-[#2D160C]">R$ {(orderData.total_amount - orderData.shipping_cost).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B4E3E]">Frete</span>
                <span className="font-medium text-[#2D160C]">R$ {orderData.shipping_cost.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[#E0B58C]/30 pt-3">
                <span className="text-[#2D160C]">Total</span>
                <span className="text-[#E0B58C]">R$ {orderData.total_amount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="text-sm text-[#6B4E3E] mt-2">
                <p><strong>Pagamento:</strong> {orderData.payment_method === 'pix' ? 'PIX' : 'Na Entrega'}</p>
              </div>
            </div>
          </section>

          {/* Mensagem de Sucesso */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-green-800">Pedido Confirmado!</h4>
                <p className="text-sm text-green-700 mt-1">
                  Seu pedido foi registrado com sucesso. Você receberá uma confirmação por e-mail em breve.
                  Nossa equipe entrará em contato para confirmar os detalhes da entrega.
                </p>
              </div>
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-[#2D160C] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:bg-[#3D2618] hover:shadow-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}