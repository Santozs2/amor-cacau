import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, LayoutDashboard, ShoppingBag, Users, MessageSquare, Star, Trophy, ClipboardList, Download, Plus, Trash2, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth, supabase } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useComments } from '../context/CommentsContext';
import { useProducts, Product } from '../context/ProductsContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CreateProductModal } from '../components/CreateProductModal';
import { EditProductModal } from '../components/EditProductModal';


export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { items } = useCart();
  const { favorites } = useFavorites();
  const { comments } = useComments();
  const { products, deleteProduct } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers' | 'comments'>('orders');
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      } else {
        supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
          if (!error && data) {
            setRealOrders(data);
          }
        });
      }
    }
  }, [loading, navigate, user, isAdmin]);

  const totalProducts = products.length;
  const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavorites = favorites.length;
  const totalComments = comments.length;

  const summaryCards = [
    {
      title: 'Produtos cadastrados',
      value: totalProducts,
      icon: <ShoppingBag size={22} />,
      color: 'bg-[#F7E7D3]',
    },
    {
      title: 'Itens no carrinho',
      value: totalCartItems,
      icon: <ClipboardList size={22} />,
      color: 'bg-[#F1D8CA]',
    },
    {
      title: 'Favoritos salvos',
      value: totalFavorites,
      icon: <Star size={22} />,
      color: 'bg-[#E8D7B9]',
    },
    {
      title: 'Comentários recentes',
      value: totalComments,
      icon: <MessageSquare size={22} />,
      color: 'bg-[#E9E3D8]',
    },
  ];

  const chartData = useMemo(() => {
    const data: Record<string, { date: string, volume: number, receita: number }> = {};
    [...realOrders].reverse().forEach(o => {
      const date = new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!data[date]) data[date] = { date, volume: 0, receita: 0 };
      data[date].volume += 1;
      data[date].receita += Number(o.total_amount);
    });
    return Object.values(data);
  }, [realOrders]);

  const downloadCSV = () => {
    if (realOrders.length === 0) return;
    const headers = ['ID', 'Cliente', 'Data', 'Status', 'Total', 'Metodo de Pagamento'];
    const rows = realOrders.map(o => [
      `"${o.id}"`, 
      `"${o.customer_name}"`, 
      `"${new Date(o.created_at).toLocaleDateString('pt-BR')}"`, 
      `"${o.status}"`, 
      o.total_amount, 
      `"${o.payment_method}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Add BOM for Excel UTF-8 reading
    const blob = new Blob(["\uFEFF"+csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'extrato_demandas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !user) {
    return (
      <main className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 bg-[#FAF6F0]">
        <div className="text-center text-[#2D160C]">
          <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-[#E0B58C] border-t-transparent animate-spin" />
          <p className="text-lg font-semibold">Carregando painel administrativo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="rounded-[2rem] border border-[#E8D8C4] bg-white shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-[#2D160C] px-4 py-2 text-[#E0B58C] text-sm uppercase tracking-[0.35em] font-bold">
                <LayoutDashboard size={18} /> ADMIN DASHBOARD
              </div>
              <h1 className="mt-6 text-4xl font-serif font-bold text-[#2D160C] tracking-tight">
                Olá, {user.user_metadata?.name || 'Administrador'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#6E5A4D] leading-7">
                Acompanhe o desempenho da loja, revise pedidos, veja produtos populares e monitore os comentários em um só lugar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                to="/cardapio"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2D160C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3F210E]"
              >
                Ver cardápio
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(card => (
              <div key={card.title} className={`rounded-3xl p-6 shadow-sm border border-[#F0E6DD] ${card.color}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl bg-white/80 p-3 text-[#2D160C]">{card.icon}</div>
                  <span className="text-xs uppercase tracking-[0.35em] text-[#5A4638]">Resumo</span>
                </div>
                <div className="mt-6">
                  <p className="text-4xl font-extrabold text-[#2D160C]">{card.value}</p>
                  <p className="mt-2 text-sm text-[#6E5A4D]">{card.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GRAFICOS BI */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E8D8C4] bg-white shadow-xl p-8">
            <h2 className="text-xl font-semibold text-[#2D160C] mb-6">Receita Diária (R$)</h2>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#8B7366" fontSize={12} />
                    <YAxis stroke="#8B7366" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="receita" stroke="#2D160C" strokeWidth={3} dot={{ r: 4, fill: '#E0B58C' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#8B7366] text-sm">Sem dados suficientes.</div>
              )}
            </div>
          </div>
          
          <div className="rounded-[2rem] border border-[#E8D8C4] bg-white shadow-xl p-8">
            <h2 className="text-xl font-semibold text-[#2D160C] mb-6">Volume de Pedidos (Un)</h2>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#8B7366" fontSize={12} />
                    <YAxis stroke="#8B7366" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: 'rgba(224, 181, 140, 0.2)' }} />
                    <Bar dataKey="volume" fill="#E0B58C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#8B7366] text-sm">Sem dados suficientes.</div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#E8D8C4] bg-white shadow-xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#2D160C]">Visão geral e Detalhes</h2>
                <p className="mt-2 text-sm text-[#6E5A4D]">Acesse a listagem dos pedidos e gestão do cardápio.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['orders', 'products', 'customers', 'comments'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'border-[#2D160C] bg-[#2D160C] text-white' : 'border-[#D9C9B2] bg-white text-[#6E5A4D]'}`}
                  >
                    {tab === 'orders' ? 'Pedidos' : tab === 'products' ? 'Produtos' : tab === 'customers' ? 'Clientes' : 'Comentários'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-8">
              {activeTab === 'orders' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#8B7366]">Total de pedidos: {realOrders.length}</p>
                    <button 
                      onClick={downloadCSV}
                      disabled={realOrders.length === 0}
                      className="flex items-center gap-2 rounded-full bg-[#FAF6F0] border border-[#E0D8C8] px-4 py-2 text-sm font-bold text-[#2D160C] transition hover:bg-[#F1D8CA] disabled:opacity-50"
                    >
                      <Download size={16} /> Exportar CSV
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {realOrders.length > 0 ? realOrders.map((order) => (
                      <div key={order.id} className="rounded-3xl border border-[#F0E6DD] p-5 bg-[#FAF8F3] shadow-sm">
                        <div className="flex items-center justify-between text-sm font-semibold text-[#2D160C]">
                          <span className="truncate max-w-[120px]" title={order.id}>{order.id.split('-')[0]}...</span>
                          <span className="rounded-full bg-[#2D160C] px-3 py-1 text-white text-[10px] uppercase tracking-wider">{order.status}</span>
                        </div>
                        <p className="mt-3 text-base font-semibold text-[#2D160C]">{order.customer_name}</p>
                        <p className="mt-2 text-sm text-[#6E5A4D]">Total: R$ {Number(order.total_amount).toFixed(2).replace('.', ',')}</p>
                        <p className="mt-1 text-xs text-[#8B7366]">{new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center text-[#6E5A4D] py-10">
                        Nenhum pedido foi fechado ou a tabela 'orders' ainda não foi criada no Supabase.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[#FAF8F3] p-5 rounded-3xl border border-[#F0E6DD]">
                    <div className="text-sm text-[#6E5A4D] font-medium max-w-sm">
                      Gerencie o seu cardápio aqui. Você não precisa alterar o código para ver novos produtos no site.
                    </div>
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-[#2D160C] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3F210E] transition shadow-md"
                    >
                      <Plus size={16} /> Adicionar Item
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <div key={product.id} className="rounded-3xl border border-[#F0E6DD] p-4 bg-white shadow-sm relative group overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="bg-blue-100/90 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition"
                            title="Editar Produto"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('Certeza que deseja excluir ' + product.name + '?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="bg-red-100/90 text-red-600 p-2 rounded-full hover:bg-red-200 transition"
                            title="Remover Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="h-32 mb-4 rounded-xl overflow-hidden bg-[#FAF6F0]">
                          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-[#2D160C] pr-8 text-sm line-clamp-2" title={product.name}>{product.name}</h3>
                          <div className="mt-3 flex items-center justify-between text-sm text-[#6E5A4D]">
                            <span className="font-black text-[#2D160C]">R$ {Number(product.price).toFixed(2)}</span>
                            <span className="rounded-full bg-[#E0D6C6] px-2 py-0.5 text-[#2D160C] text-[10px] font-bold uppercase">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="col-span-full pt-6 text-center text-[#8B7366] text-sm">O cardápio está vazio ou a tabela products ainda não existe no Supabase.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="rounded-3xl border border-[#F0E6DD] bg-[#FAF8F3] p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D160C]">Clientes e controle</h3>
                      <p className="mt-2 text-sm text-[#6E5A4D]">Para ver todos os clientes, crie uma tabela de profiles no Supabase e conecte aqui.</p>
                    </div>
                    <span className="rounded-full bg-[#2D160C] px-4 py-2 text-white text-sm">Sem dados de clientes</span>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-3xl border border-[#E0D6C6] bg-white p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Usuários no carrinho</p>
                      <p className="mt-3 text-3xl font-semibold text-[#2D160C]">{totalCartItems}</p>
                    </div>
                    <div className="rounded-3xl border border-[#E0D6C6] bg-white p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Favoritos ativos</p>
                      <p className="mt-3 text-3xl font-semibold text-[#2D160C]">{totalFavorites}</p>
                    </div>
                    <div className="rounded-3xl border border-[#E0D6C6] bg-white p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#8B7366]">Comentários</p>
                      <p className="mt-3 text-3xl font-semibold text-[#2D160C]">{totalComments}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.slice(0, 5).map((comment) => (
                        <div key={comment.id} className="rounded-3xl border border-[#F0E6DD] bg-[#FAF8F3] p-5 shadow-sm">
                          <div className="flex items-center justify-between gap-3 text-sm text-[#6E5A4D]">
                            <span>{comment.user_name}</span>
                            <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="mt-3 text-[#2D160C]">{comment.comment}</p>
                          <p className="mt-3 text-xs text-[#8B7366]">Nota: {comment.rating}/5</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-[#F0E6DD] bg-[#FAF8F3] p-8 text-center text-[#6E5A4D]">
                      Nenhum comentário carregado ainda. Acesse um produto e carregue os comentários para ver aqui.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
        />
      )}
    </main>
  );
}
