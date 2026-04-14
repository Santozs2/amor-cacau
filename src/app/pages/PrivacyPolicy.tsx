import React from 'react';
import { Link } from 'react-router';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield size={40} className="text-[#E0B58C]" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2D160C] tracking-tight font-serif">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-[#6B4E3E] text-lg max-w-2xl mx-auto">
            Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.
          </p>
          <div className="h-1 w-24 bg-[#E0B58C] rounded-full mt-6 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none text-[#2D160C] space-y-8">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">1. Informações que Coletamos</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4">Coletamos informações que você nos fornece diretamente:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li><strong>Informações de conta:</strong> nome, e-mail, senha</li>
                <li><strong>Informações de entrega:</strong> endereço, telefone, CEP</li>
                <li><strong>Informações de pagamento:</strong> dados processados por nossos parceiros (Stripe/Mercado Pago)</li>
                <li><strong>Histórico de pedidos:</strong> produtos comprados, datas, valores</li>
                <li><strong>Preferências:</strong> produtos favoritos, configurações da conta</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">2. Como Usamos suas Informações</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li>Processar e entregar seus pedidos</li>
                <li>Fornecer atendimento ao cliente</li>
                <li>Enviar confirmações de pedido e atualizações</li>
                <li>Personalizar sua experiência na loja</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">3. Compartilhamento de Informações</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4">Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li><strong>Parceiros de pagamento:</strong> Stripe e Mercado Pago para processamento seguro</li>
                <li><strong>Serviços de entrega:</strong> informações necessárias para entrega dos pedidos</li>
                <li><strong>Obrigações legais:</strong> quando exigido por lei ou para proteger direitos</li>
                <li><strong>Seu consentimento:</strong> com sua permissão explícita</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">4. Segurança dos Dados</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado,
                alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS para transmissão de dados e nossos servidores são protegidos
                por firewalls e sistemas de monitoramento.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">5. Cookies e Tecnologias Similares</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4 text-[#6B4E3E]">Utilizamos cookies e tecnologias similares para:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li>Manter você conectado à sua conta</li>
                <li>Lembrar suas preferências de navegação</li>
                <li>Analisar o uso do site para melhorias</li>
                <li>Fornecer funcionalidades essenciais da loja</li>
              </ul>
              <p className="mt-4 text-[#6B4E3E]">
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="text-[#E0B58C]" size={24} />
              <h2 className="text-2xl font-bold text-[#2D160C] font-serif">6. Seus Direitos</h2>
            </div>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4">Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B4E3E]">
                <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> solicitar a correção de dados incompletos ou incorretos</li>
                <li><strong>Exclusão:</strong> solicitar a exclusão dos seus dados pessoais</li>
                <li><strong>Portabilidade:</strong> solicitar a transferência dos seus dados</li>
                <li><strong>Oposição:</strong> opor-se ao processamento dos seus dados</li>
              </ul>
              <p className="mt-4 text-[#6B4E3E]">
                Para exercer esses direitos, entre em contato conosco através do e-mail: privacidade@amor-cacau.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">7. Retenção de Dados</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política,
                ou conforme exigido por lei. Dados de pedidos são mantidos por 5 anos para cumprimento de obrigações fiscais e legais.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">8. Menores de Idade</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores de idade.
                Se tomarmos conhecimento de que coletamos informações de um menor, tomaremos medidas para excluir essas informações.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">9. Alterações nesta Política</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="text-[#6B4E3E]">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas através de e-mail
                ou aviso destacado em nosso site. O uso continuado do serviço após alterações constitui aceitação da política atualizada.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#2D160C] font-serif mb-4">10. Contato</h2>
            <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#F0E6DD]">
              <p className="mb-4 text-[#6B4E3E]">Para dúvidas sobre esta política ou sobre seus dados pessoais:</p>
              <div className="space-y-2 text-[#6B4E3E]">
                <p><strong>E-mail:</strong> privacidade@amor-cacau.com</p>
                <p><strong>Telefone:</strong> (11) 9999-9999</p>
                <p><strong>Endereço:</strong> Rua das Delícias, 123 - São Paulo, SP</p>
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