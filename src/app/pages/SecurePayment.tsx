import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import QRCode from 'qrcode';
import { Check, X } from 'lucide-react';

interface OrderData {
  user_id: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  address: Record<string, string>;
  payment_method: string;
  total: number;
  status: string;
}

export function SecurePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const orderData = (location.state as { orderData?: OrderData })?.orderData;

  useEffect(() => {
    if (orderData && qrCanvasRef.current) {
      const paymentCode = `00020126580014br.gov.bcb.pix0136550e8cd4-8e22-4d86-96eb-4eb0dc5f26c45204000053039865802BR5913JOHN BAKERY6009SAO PAULO62730503***630429C6`;
      QRCode.toCanvas(qrCanvasRef.current, paymentCode, {
        width: 220,
        margin: 2,
        color: { dark: '#2D160C', light: '#FDFBF7' },
      }).catch(console.error);
    }
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-w-xl w-full rounded-3xl bg-white p-8 text-center shadow-2xl">
          <p className="text-lg font-semibold text-[#2D160C]">Pedido não encontrado.</p>
          <p className="mt-3 text-sm text-[#6B4E3E]">Volte para o carrinho e tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2D160C] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#E0B58C]"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E0D8C5] p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Pagamento Seguro</p>
            <h1 className="mt-1 text-2xl font-serif font-extrabold text-[#2D160C]">Complete seu pagamento</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-[#2D160C] transition-all duration-300 hover:bg-[#FAF6F0] cursor-pointer"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#E0D8C5] bg-[#FAF6F0] p-5">
              <p className="text-sm text-[#6B4E3E]">Use o QR code abaixo no seu app bancário para concluir o pagamento com segurança.</p>
            </div>

            <div className="rounded-3xl border border-[#E0D8C5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0B58C]/15 text-[#2D160C]">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-sm text-[#6B4E3E]">Pedido registrado</p>
                  <p className="text-base font-semibold text-[#2D160C]">Total: R$ {orderData.total.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <div className="space-y-3">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-[#6B4E3E]">
                    <span>{item.name} x{item.quantity}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E0D8C5] bg-white p-5 text-center">
            <div className="inline-flex items-center justify-center rounded-3xl bg-[#FAF6F0] p-5 shadow-sm">
              <canvas ref={qrCanvasRef} />
            </div>
            <p className="mt-5 text-sm text-[#6B4E3E]">Escaneie este código com qualquer aplicativo de pagamento para finalizar sua compra.</p>
            <div className="mt-5 rounded-3xl border border-[#E0D8C5] bg-[#FAF6F0] p-4 text-left text-sm text-[#2D160C]">
              <p className="font-semibold">Instruções de pagamento</p>
              <p className="mt-2 text-xs text-[#6B4E3E]">Clique em continuar no seu app após efetuar o pagamento. O pedido será confirmado em seguida.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
