import React from 'react';
import { Link } from 'react-router';
import { FileText, Users, ShoppingCart, CreditCard, Truck, Shield, AlertTriangle, Mail } from 'lucide-react';

export function TermsOfUse() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText size={40} className="text-[#E0B58C]" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif">
              Termos de Uso
            </h1>
          </div>
          <p className="text-[#6B4E3E] text-lg max-w-2xl mx-auto">
            Estes termos regem o uso do nosso site e serviços. Ao acessar ou usar nossos serviços, você concorda com estes termos.
          </p>
          <div className="h-1 w-24 bg-[#E0B58C] rounded-full mt-6 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-[#2D160C] space-y-8">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">1. Aceitação dos Termos</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Ao acessar e usar o site Amor & Cacau, você aceita e concorda em cumprir os termos e condições aqui descritos.
                Se você não concordar com estes termos, não use nossos serviços.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">2. Descrição do Serviço</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4 text-[#6B4E3E]">O Amor & Cacau oferece:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li>Venda online de produtos de confeitaria artesanal</li>
                <li>Sistema de conta de usuário com histórico de pedidos</li>
                <li>Lista de produtos favoritos</li>
                <li>Processamento seguro de pagamentos</li>
                <li>Serviço de entrega de pedidos</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">3. Elegibilidade</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Para usar nossos serviços, você deve ter pelo menos 18 anos de idade ou ter autorização dos pais/responsáveis.
                Ao criar uma conta, você declara que tem capacidade legal para celebrar contratos.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">4. Pedidos e Pagamentos</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <div className="space-y-4 text-[#6B4E3E]">
                <p><strong>4.1 Processamento de Pedidos:</strong> Todos os pedidos estão sujeitos à disponibilidade e confirmação.</p>
                <p><strong>4.2 Preços:</strong> Os preços podem ser alterados sem aviso prévio, mas o preço cobrado será o vigente no momento do pedido.</p>
                <p><strong>4.3 Pagamento:</strong> Aceitamos cartão de crédito, débito, PIX e dinheiro. O pagamento é processado por parceiros certificados.</p>
                <p><strong>4.4 Confirmação:</strong> Você receberá confirmação do pedido por e-mail após a conclusão.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">5. Entrega</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <div className="space-y-4 text-[#6B4E3E]">
                <p><strong>5.1 Prazos:</strong> Os prazos de entrega são estimados e podem variar devido a fatores externos.</p>
                <p><strong>5.2 Responsabilidade:</strong> Somos responsáveis pela entrega até o endereço fornecido. Danos durante o transporte devem ser reportados imediatamente.</p>
                <p><strong>5.3 Áreas de Entrega:</strong> Atendemos regiões específicas. Verifique a disponibilidade antes do pedido.</p>
                <p><strong>5.4 Ausência:</strong> Em caso de ausência no endereço, novas tentativas podem gerar custos adicionais.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">6. Política de Cancelamento e Devolução</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <div className="space-y-4 text-[#6B4E3E]">
                <p><strong>6.1 Cancelamento:</strong> Pedidos podem ser cancelados até 2 horas após a confirmação, desde que não tenham sido preparados.</p>
                <p><strong>6.2 Devolução:</strong> Produtos danificados ou incorretos podem ser devolvidos. Entre em contato em até 24 horas após o recebimento.</p>
                <p><strong>6.3 Reembolso:</strong> Reembolsos são processados em até 7 dias úteis após análise e aprovação.</p>
                <p><strong>6.4 Produtos Personalizados:</strong> Itens feitos sob encomenda não podem ser cancelados após a produção.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">7. Uso Proibido</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4">É proibido:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li>Usar o site para atividades ilegais ou fraudulentas</li>
                <li>Tentar acessar sistemas não autorizados</li>
                <li>Distribuir vírus ou códigos maliciosos</li>
                <li>Copiar ou reproduzir conteúdo sem autorização</li>
                <li>Fazer pedidos falsos ou especulativos</li>
                <li>Usar informações de terceiros sem consentimento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">8. Propriedade Intelectual</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Todo o conteúdo do site (textos, imagens, logos, design) é propriedade do Amor & Cacau ou de seus licenciadores.
                É proibida a reprodução, distribuição ou uso comercial sem autorização prévia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">9. Limitação de Responsabilidade</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Não nos responsabilizamos por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso do site.
                Nossa responsabilidade máxima é limitada ao valor pago pelo produto ou serviço em questão.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">10. Links para Terceiros</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Nosso site pode conter links para sites de terceiros. Não nos responsabilizamos pelo conteúdo ou práticas de privacidade desses sites.
                O acesso a links externos é por sua conta e risco.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">11. Modificações dos Termos</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Podemos modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após publicação no site.
                O uso continuado do serviço constitui aceitação dos novos termos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">12. Lei Aplicável</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro da Comarca de São Paulo, SP,
                renunciando a qualquer outro, por mais privilegiado que seja.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">13. Contato</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4 text-[#6B4E3E]">Para dúvidas sobre estes termos:</p>
              <div className="space-y-2 text-[#6B4E3E]">
                <p><strong>E-mail:</strong> contato@amor-cacau.com</p>
                <p><strong>Telefone:</strong> (11) 9999-9999</p>
                <p><strong>Horário:</strong> Segunda a Sexta, 8h às 18h</p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8 border-t border-[#F0E6DD]">
            <p className="text-sm text-[#8B7366]">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#2D160C] text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300"
          >
            Voltar para a Loja
          </Link>
        </div>
      </div>
    </main>
  );
}