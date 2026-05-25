import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Truck, Lock, Check, Copy, X, AlertCircle, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';
import { useCart } from '../context/CartContext';
import { useAuth, supabase } from '../context/AuthContext';
import { toast } from 'sonner';
import { PurchaseConfirmationModal } from './PurchaseConfirmationModal';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutFormProps {
  onClose: () => void;
}

const STORE_LAT = -23.5505;
const STORE_LON = -46.6333;

export function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'on-delivery'>('pix');
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const pixData = {
    qrCode: `00020126580014br.gov.bcb.pix0136550e8cd4-8e22-4d86-96eb-4eb0dc5f26c45204000053039865802BR5913JOHN BAKERY6009SAO PAULO62730503***630429C6`,
    key: '550e8cd4-8e22-4d86-96eb-4eb0dc5f26c4',
    bankName: 'Love Bakery Bank',
    accountType: 'Conta Corrente',
    accountNumber: '12345-6',
  };

  useEffect(() => {
    if (paymentMethod === 'pix' && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, pixData.qrCode, {
        width: 200,
        margin: 2,
        color: { dark: '#2D160C', light: '#FDFBF7' },
      }).catch((err: Error) => console.error('Erro ao gerar QR code:', err));
    }
  }, [paymentMethod, pixData.qrCode]);

  const fetchAddressFromCep = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsCalculatingShipping(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setShippingCost(15);
        toast.info('CEP não encontrado, aplicada taxa padrão de R$ 15,00');
        return;
      }

      // Preencher endereço
      setAddress(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));

      // Calcular frete baseado na cidade (aproximação)
      const distance = data.localidade === 'São Paulo' ? 5 : 10; // Exemplo simplificado
      const cost = Math.max(1, distance);
      setShippingCost(cost);
      toast.success(`Endereço preenchido. Frete: R$ ${cost.toFixed(2).replace('.', ',')} (${distance} km aproximado)`);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setShippingCost(15);
      toast.error('Erro ao buscar endereço');
    } finally {
      setIsCalculatingShipping(false);
    }
  }, []);

  useEffect(() => {
    const cleanCep = address.zipCode.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const timeoutId = setTimeout(() => {
        fetchAddressFromCep(address.zipCode);
      }, 800); // Melhor debounce
      
      return () => clearTimeout(timeoutId);
    } else {
      setShippingCost(null);
    }
  }, [address.zipCode, fetchAddressFromCep]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalizeShipping = shippingCost !== null ? shippingCost : 0;
  const finalTotal = total + finalizeShipping;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = (): { isValid: boolean; error?: string } => {
    const required: (keyof Address)[] = ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];

    for (const field of required) {
      const value = address[field];
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          error: `O campo ${getFieldLabel(field)} é obrigatório`
        };
      }
    }

    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(address.zipCode.replace(/\s/g, ''))) {
      return {
        isValid: false,
        error: 'CEP inválido. Use o formato 00000-000'
      };
    }

    if (shippingCost === null && !isCalculatingShipping) {
      return {
        isValid: false,
        error: 'Aguarde o cálculo do frete preenchendo um CEP válido'
      };
    }

    return { isValid: true };
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixData.key);
    setCopiedPixKey(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopiedPixKey(false), 2000);
  };

  const paymentOptions: Array<{ id: 'pix' | 'on-delivery'; label: string; desc: string }> = [
    { id: 'pix', label: 'PIX (Antecipado)', desc: 'Transferência instantânea e desconto na hora' },
    { id: 'on-delivery', label: 'Pagamento na Entrega/Retirada', desc: 'Cartões e Dinheiro aceitos presencialmente' },
  ];

  const getFieldLabel = (field: keyof Address): string => {
    const labels: Record<keyof Address, string> = {
      street: 'Rua',
      number: 'Número',
      complement: 'Complemento',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      zipCode: 'CEP'
    };
    return labels[field];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Faça login para continuar');
      return;
    }

    const validation = validateAddress();
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    setIsProcessing(true);

    const orderData = {
      user_id: user.id,
      customer_name: user?.user_metadata?.name || 'Cliente',
      total_amount: finalTotal,
      shipping_cost: finalizeShipping,
      payment_method: paymentMethod,
      items: items,
      address: address,
      status: 'Aguardando',
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      
      if (error) {
        console.error('Supabase Error:', error);
        throw new Error('Falha ao salvar no Supabase');
      }

      toast.success('Pedido realizado com sucesso!', {
        description: 'Confira os detalhes do seu pedido.',
      });
      clearCart();
      setOrderData(orderData);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E0D8C5]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Amor & Cacau</p>
            <h2 className="mt-1 text-2xl font-serif font-extrabold text-[#2D160C]">Finalizar Compra</h2>
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
        <div className="p-4 sm:p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Endereço */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#E0B58C]" />
              <h3 className="text-lg font-semibold text-[#2D160C]">Endereço de Entrega</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Rua *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Número *</label>
                <input
                  type="text"
                  required
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
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={address.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">Estado *</label>
                <select
                  required
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                >
                  <option value="">Selecione o estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="BA">Bahia</option>
                  <option value="PE">Pernambuco</option>
                  <option value="CE">Ceará</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B4E3E] mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  value={address.zipCode}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
                    handleAddressChange('zipCode', val.substring(0, 9));
                  }}
                  className="w-full px-3 py-2 border border-[#F0E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0B58C] bg-white text-[#2D160C] text-sm"
                  placeholder="01234-567"
                />
              </div>
            </div>
          </section>

          {/* Método de Pagamento */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-[#E0B58C]" />
              <h3 className="text-lg font-semibold text-[#2D160C]">Forma de Pagamento</h3>
            </div>

            <div className="bg-[#FFF8E7] text-[#8B6400] text-sm p-4 rounded-xl flex gap-3 items-start mb-5 border border-[#FFE1A8]">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>
                Qualquer tipo de pagamento via cartões ou dinheiro deve ser realizado <strong>exclusivamente</strong> na retirada ou no ato da entrega de cada produto presencialmente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {paymentOptions.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer ${
                    paymentMethod === method.id
                      ? 'border-2 border-[#2D160C] bg-[#2D160C] text-white shadow-lg scale-100'
                      : 'border-2 border-[#E0D8C5] bg-white text-[#2D160C] hover:border-[#E0B58C] hover:scale-102'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{method.label}</p>
                      <p className={`text-xs mt-1 ${paymentMethod === method.id ? 'text-white/80' : 'text-[#6B4E3E]'}`}>
                        {method.desc}
                      </p>
                    </div>
                    {paymentMethod === method.id && <Check size={18} />}
                  </div>
                </button>
              ))}
            </div>

            {/* PIX QR Code */}
            {paymentMethod === 'pix' && (
              <div className="bg-white rounded-2xl p-5 border border-[#E0B58C]/30 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-lg border-2 border-[#E0B58C] shadow-md transition-all duration-300">
                      <canvas ref={qrCanvasRef} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-[#6B4E3E]">Banco</p>
                    <p className="font-semibold text-[#2D160C]">{pixData.bankName}</p>
                  </div>
                  <div className="bg-[#FAF6F0] rounded-lg p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8B7366] mb-2">Chave PIX (copia e cola)</p>
                    <button
                      type="button"
                      onClick={copyPixKey}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#E0D8C5] rounded-lg hover:border-[#E0B58C] transition-all text-[#2D160C] text-sm hover:shadow-sm"
                    >
                      <span className="font-mono text-xs break-all text-left">{pixData.key}</span>
                      <Copy size={16} className="ml-2 flex-shrink-0" />
                    </button>
                    {copiedPixKey && <p className="text-xs text-green-600 mt-1 animate-in fade-in duration-200">✓ Copiado!</p>}
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'on-delivery' && (
              <div className="bg-white rounded-2xl p-5 border border-[#E0B58C]/30 space-y-3 animate-in fade-in duration-300">
                <p className="text-sm text-[#6B4E3E] text-center font-medium">Você irá realizar o pagamento no momento do recebimento. Nossos motoqueiros levam maquininha de cartão e troco se necessário!</p>
              </div>
            )}
          </section>

          {/* Resumo do Pedido */}
          <section className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={20} className="text-[#E0B58C]" />
              <h3 className="text-lg font-semibold text-[#2D160C]">Resumo do Pedido</h3>
            </div>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-[#6B4E3E]">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0B58C]/30 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B4E3E]">Subtotal</span>
                <span className="font-medium text-[#2D160C]">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B4E3E]">Frete (R$ 1/km)</span>
                <span className={`font-medium ${shippingCost === null ? 'text-gray-400' : 'text-[#2D160C]'}`}>
                  {isCalculatingShipping ? 'Calculando...' : (shippingCost === null ? 'Informe o CEP' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[#E0B58C]/30 pt-3">
                <span className="text-[#2D160C]">Total</span>
                <span className="text-[#E0B58C]">
                  R$ {(shippingCost !== null ? finalTotal : total).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </section>

          {/* Botão Submit */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || shippingCost === null || isCalculatingShipping}
            className="w-full rounded-2xl bg-[#2D160C] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:bg-[#3D2618] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isProcessing ? 'Processando...' : 
             (isCalculatingShipping ? 'Aguarde o frete...' : 
               `Confirmar Pedido - R$ ${shippingCost !== null ? finalTotal.toFixed(2).replace('.', ',') : total.toFixed(2).replace('.', ',')}`
             )}
          </button>

          {/* Segurança */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#6B4E3E]">
            <Lock size={14} />
            <p>Suas informações estão 100% protegidas</p>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmationModal && orderData && (
        <PurchaseConfirmationModal
          orderData={orderData}
          onClose={() => {
            setShowConfirmationModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
