import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, supabase } from '../context/AuthContext';
import { Loader2, CheckCircle2, Truck, CreditCard, Hourglass, Shield, XCircle } from 'lucide-react';

const statusOptions = [
  { key: 'all', label: 'Tudo' },
  { key: 'a-pagar', label: 'A pagar' },
  { key: 'preparando', label: 'Preparando' },
  { key: 'a-caminho', label: 'A caminho' },
  { key: 'finalizado', label: 'Finalizado' },
  { key: 'cancelado', label: 'Cancelado' },
] as const;

type StatusFilter = (typeof statusOptions)[number]['key'];

const statusLabelMap: Record<string, string> = {
  Aguardando: 'A pagar',
  'A pagar': 'A pagar',
  Preparando: 'Preparando',
  'A caminho': 'A caminho',
  Finalizado: 'Finalizado',
  Cancelado: 'Cancelado',
};

const statusIconMap: Record<string, JSX.Element> = {
  'A pagar': <CreditCard size={16} />,
  Preparando: <Hourglass size={16} />,
  'A caminho': <Truck size={16} />,
  Finalizado: <CheckCircle2 size={16} />,
  Cancelado: <XCircle size={16} />,
};

export function MinhasCompras() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!loading && user) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Erro ao buscar pedidos:', error);
            setOrders([]);
            return;
          }

          setOrders(data || []);
        } catch (error) {
          console.error('Erro ao buscar pedidos:', error);
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [loading, user]);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'all') {
      return orders;
    }

    return orders.filter(order => {
      const currentStatus = statusLabelMap[order.status] || order.status;
      if (selectedFilter === 'a-pagar') {
        return currentStatus === 'A pagar';
      }
      return currentStatus === statusOptions.find(option => option.key === selectedFilter)?.label;
    });
  }, [orders, selectedFilter]);

  const summaryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      'a-pagar': 0,
      preparando: 0,
      'a-caminho': 0,
      finalizado: 0,
      cancelado: 0,
    };

    orders.forEach(order => {
      const label = statusLabelMap[order.status] || order.status;
      if (label === 'A pagar') counts['a-pagar'] += 1;
      if (label === 'Preparando') counts.preparando += 1;
      if (label === 'A caminho') counts['a-caminho'] += 1;
      if (label === 'Finalizado') counts.finalizado += 1;
      if (label === 'Cancelado') counts.cancelado += 1;
    });

    return counts;
  }, [orders]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-[#FAF6F0] p-6">
        <div className="flex items-center gap-3 text-[#2D160C]">
          <Loader2 className="animate-spin" />
          <span>Carregando seus pedidos...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-[#FAF6F0] p-6">
        <div className="rounded-3xl border border-[#E0D8C5] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#2D160C]">Você precisa entrar para ver suas compras.</p>
          <p className="mt-3 text-sm text-[#6E5A4D]">Faça login para acessar o histórico de pedidos e acompanhar o status.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF6F0]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-[#E8D8C4] bg-white shadow-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Minha Conta</p>
              <h1 className="mt-3 text-4xl font-serif font-bold text-[#2D160C]">Minhas Compras</h1>
              <p className="mt-3 text-sm text-[#6E5A4D] max-w-2xl">
                Veja todos os pedidos feitos em sua conta e filtre por status de pagamento e entrega.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {statusOptions.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedFilter(option.key)}
                className={`rounded-3xl border px-4 py-4 text-left transition-all ${selectedFilter === option.key ? 'border-[#2D160C] bg-[#2D160C] text-white shadow-lg' : 'border-[#E0D8C5] bg-[#FAF6F0] text-[#2D160C] hover:border-[#E0B58C]'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-xs uppercase text-[#6E5A4D]">{summaryCounts[option.key]}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-3 text-[#2D160C]">
                <Loader2 className="animate-spin" />
                <span>Atualizando pedidos...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-[#E0D8C5] bg-[#FAF8F3] p-8 text-center text-[#6E5A4D]">
                <p className="font-semibold text-[#2D160C]">Nenhum pedido encontrado.</p>
                <p className="mt-2 text-sm">Tente outro filtro ou aguarde novos pedidos.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const currentStatus = statusLabelMap[order.status] || order.status;
                  const icon = statusIconMap[currentStatus] || <Shield size={16} />;

                  return (
                    <div key={order.id} className="rounded-3xl border border-[#E0D8C5] bg-[#FAF8F3] p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Pedido #{order.id}</p>
                          <p className="mt-2 text-xl font-semibold text-[#2D160C]">R$ {Number(order.total_amount).toFixed(2).replace('.', ',')}</p>
                          <p className="mt-1 text-sm text-[#6E5A4D]">Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold text-[#2D160C] bg-white">
                          {icon}
                          {currentStatus}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-3xl bg-white p-4 border border-[#E0D8C5]">
                          <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Pagamento</p>
                          <p className="mt-2 text-sm text-[#2D160C]">{order.payment_method === 'pix' ? 'PIX' : 'Na Entrega'}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-4 border border-[#E0D8C5]">
                          <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Frete</p>
                          <p className="mt-2 text-sm text-[#2D160C]">R$ {Number(order.shipping_cost).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-4 border border-[#E0D8C5]">
                          <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Itens</p>
                          <p className="mt-2 text-sm text-[#2D160C]">{Array.isArray(order.items) ? order.items.length : 0} produtos</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
