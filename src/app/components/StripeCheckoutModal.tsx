import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle2, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

function CheckoutForm({ onSuccess, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Mocking payment delay to simulate processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1 flex items-center gap-2">
            <CreditCard size={14} />
            Nome no Cartão
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: João da Silva"
            className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1 flex items-center gap-2">
            <Shield size={14} />
            Dados do Cartão
          </label>
          <div className="p-4 bg-[#FAF6F0] border border-[#F0E6DD] rounded-xl focus-within:ring-2 focus-within:ring-[#E0B58C] transition-all">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '15px',
                    color: '#2D160C',
                    '::placeholder': {
                      color: '#8B7366',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full bg-[#2D160C] text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D160C] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <span>Pagar R$ {amount.toFixed(2).replace('.', ',')}</span>
        )}
      </button>
    </form>
  );
}

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function StripeCheckoutModal({ isOpen, onClose, amount }: StripeCheckoutModalProps) {
  const { clearCart, setIsCartOpen } = useCart();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setSuccess(true);
    import('sonner').then(({ toast }) => {
      toast.success('Pagamento aprovado!', {
        description: 'Seu pedido foi confirmado e já está sendo preparado.'
      });
    });
    setTimeout(() => {
      clearCart();
      setSuccess(false);
      onClose();
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !success && onClose()}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {!success && (
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#2D160C] to-[#4A2616] text-[#E0B58C]">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-[#E0B58C]" />
              <h2 className="text-xl font-serif font-bold tracking-wider">Pagamento Seguro</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all transform hover:rotate-180 hover:scale-110 duration-500 cursor-pointer p-1 rounded-full hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={56} className="text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-[#2D160C]">Pagamento Aprovado!</h3>
                <p className="text-[#6B4E3E] text-lg">
                  Seu pedido foi confirmado e já começaremos a prepará-lo com muito carinho.
                </p>
              </div>
              <div className="w-full max-w-xs bg-[#FAF6F0] rounded-xl p-4 border border-[#F0E6DD]">
                <p className="text-sm text-[#6B4E3E] font-medium">
                  Você receberá um e-mail de confirmação em breve com os detalhes do seu pedido.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-serif font-bold text-[#2D160C]">Finalizar Compra</h3>
                <p className="text-[#6B4E3E] text-sm">
                  Complete suas informações para processar o pagamento de forma segura.
                </p>
              </div>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm onSuccess={handleSuccess} amount={amount} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
