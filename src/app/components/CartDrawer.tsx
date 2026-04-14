import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Truck, CreditCard, Banknote, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { CheckoutForm } from './CheckoutForm';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'on-delivery'>('pix');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const shippingCost = cartTotal > 50 ? 0 : (shippingMethod === 'standard' ? 12.90 : 25.50);
  const finalTotal = items.length > 0 ? cartTotal + shippingCost : 0;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-xl md:max-w-2xl flex">
        <div className="relative ml-auto h-full w-full max-w-xl md:max-w-2xl bg-[#FDFBF7] shadow-2xl ring-1 ring-black/10 overflow-hidden rounded-l-[2rem] md:rounded-l-[2rem] md:rounded-r-none">
          <div className="flex items-center justify-between border-b border-[#E0B58C]/20 bg-gradient-to-r from-[#2D160C] via-[#452B18] to-[#4A2616] px-6 py-5 text-[#E0B58C]">
            <div className="flex items-center gap-3">
              <ShoppingBag size={22} className="text-[#E0B58C]/90" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#F8E6CE]">Minha Sacola</p>
                <h2 className="text-xl font-serif font-bold">Finalize sua compra</h2>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full bg-white/10 p-2 text-white transition duration-200 hover:bg-white/20 hover:rotate-180"
              aria-label="Fechar carrinho"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex h-[calc(100vh-88px)] flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 bg-[#FAF6F0]/70">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center text-[#8B7366]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F0E6DD] shadow-inner">
                    <ShoppingBag size={44} className="text-[#2D160C]/20" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#2D160C]">Sua cesta está vazia</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#6B4E3E]">Escolha um doce ou bolo para começar a sua encomenda.</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full bg-[#E0B58C] px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#2D160C] shadow-lg transition hover:bg-[#D4A373] cursor-pointer"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.35em] text-[#6B4E3E] border-b border-[#E0E0E0] pb-3">
                      <span>Resumo ({items.length} itens)</span>
                      <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="rounded-[2rem] border border-[#E0D8C8] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex gap-4">
                            <div className="h-24 w-24 overflow-hidden rounded-[1.5rem] bg-[#FAF6F0]">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <h4 className="text-base font-semibold text-[#2D160C]">{item.name}</h4>
                                <p className="mt-2 text-sm text-[#6B4E3E]">R$ {item.price.toFixed(2).replace('.', ',')} por unidade</p>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center rounded-full border border-[#E0D8C8] bg-[#FAF6F0]">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-9 w-9 flex items-center justify-center text-[#4A2616] transition hover:bg-[#E0B58C] hover:text-[#2D160C] rounded-full"
                                  >
                                    <Minus size={14} strokeWidth={3} />
                                  </button>
                                  <span className="w-10 text-center text-sm font-bold text-[#2D160C]">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-9 w-9 flex items-center justify-center text-[#4A2616] transition hover:bg-[#E0B58C] hover:text-[#2D160C] rounded-full"
                                  >
                                    <Plus size={14} strokeWidth={3} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 transition hover:text-red-700"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[2rem] border border-[#E0D8C8] bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E0E0E0] text-sm font-bold uppercase tracking-[0.35em] text-[#6B4E3E]">
                        <span>Entrega</span>
                        <span>{shippingMethod === 'standard' ? 'Padrão' : 'Expressa'}</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                          onClick={() => setShippingMethod('standard')}
                          className={`rounded-[1.5rem] border p-4 text-left transition ${shippingMethod === 'standard' ? 'border-[#E0B58C] bg-[#E0B58C]/10 shadow-sm' : 'border-[#E0D8C8] bg-white text-[#6B4E3E] hover:border-[#E0B58C]'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[#2D160C]">Padrão</p>
                              <p className="text-xs text-[#6B4E3E]">2-3 dias úteis</p>
                            </div>
                            <p className="text-sm font-bold text-[#2D160C]">R$ 12,90</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setShippingMethod('express')}
                          className={`rounded-[1.5rem] border p-4 text-left transition ${shippingMethod === 'express' ? 'border-[#E0B58C] bg-[#E0B58C]/10 shadow-sm' : 'border-[#E0D8C8] bg-white text-[#6B4E3E] hover:border-[#E0B58C]'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[#2D160C]">Expressa</p>
                              <p className="text-xs text-[#6B4E3E]">Entrega hoje</p>
                            </div>
                            <p className="text-sm font-bold text-[#2D160C]">R$ 25,50</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#E0D8C8] bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E0E0E0] text-sm font-bold uppercase tracking-[0.35em] text-[#6B4E3E]">
                        <span>Pagamento</span>
                        <span>Escolha</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod('pix')}
                          className={`rounded-[1.5rem] border p-4 text-center transition ${paymentMethod === 'pix' ? 'border-[#2D160C] bg-[#2D160C] text-white shadow-sm' : 'border-[#E0D8C8] bg-white text-[#6B4E3E] hover:border-[#E0B58C]'}`}
                        >
                          <QrCode size={20} className="mx-auto mb-2" />
                          <p className="text-[11px] font-bold uppercase tracking-[0.35em]">PIX</p>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('on-delivery')}
                          className={`rounded-[1.5rem] border p-4 text-center transition ${paymentMethod === 'on-delivery' ? 'border-[#2D160C] bg-[#2D160C] text-white shadow-sm' : 'border-[#E0D8C8] bg-white text-[#6B4E3E] hover:border-[#E0B58C]'}`}
                        >
                          <Banknote size={20} className="mx-auto mb-2" />
                          <p className="text-[11px] font-bold uppercase tracking-[0.35em]">Na Entrega</p>
                        </button>
                      </div>
                      
                      <div className="mt-4 bg-[#FFF8E7] text-[#8B6400] text-xs p-3 rounded-xl flex gap-3 items-start border border-[#FFE1A8]">
                        <p>
                          Qualquer pagamento sem ser PIX antecipado será feito de forma presencial na retirada ou entrega.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#E0B58C]/20 bg-white px-6 py-6 md:px-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-[#6B4E3E]">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#6B4E3E]">
                    <span>Frete</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shippingCost === 0 ? 'Grátis (acima de R$ 50)' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  {cartTotal < 50 && shippingCost > 0 && (
                    <div className="text-xs text-[#8B7366]">Adicione R$ {(50 - cartTotal).toFixed(2).replace('.', ',')} para frete grátis</div>
                  )}
                  <div className="flex items-center justify-between text-2xl font-serif font-black text-[#2D160C] pt-3 border-t border-[#E0E0E0]">
                    <span>Total</span>
                    <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="mt-4 w-full rounded-full bg-[#2D160C] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-[#E0B58C] hover:text-[#2D160C] cursor-pointer"
                >
                  Continuar para Finalização
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && <CheckoutForm onClose={() => setIsCheckoutOpen(false)} />}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(240, 230, 221, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(224, 181, 140, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 22, 12, 0.6);
        }
      `}</style>
    </div>
  );
}
