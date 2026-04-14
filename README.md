# 🍫 Amor & Cacau - Confeitaria Online

Uma plataforma de e-commerce moderna e responsiva para confeitaria artesanal com funcionalidades completas de vendas, gestão de produtos e acompanhamento de pedidos.

## ✨ Características Principais

### 🛍️ Para Clientes
- **Catálogo de Produtos**: Navegação por categorias (Doces, Tortas, Bolos, Especiais, Bebidas, Pães)
- **Carrinho de Compras**: Adicionar, remover e gerenciar quantidade de itens
- **Favoritos**: Salvar produtos preferidos para compra posterior
- **Checkout Completo**: 
  - Cálculo automático de frete via CEP (integração com ViaCEP)
  - Pagamento via PIX com QR Code
  - Pagamento na entrega
- **Minhas Compras**: Histórico de pedidos com filtros de status (A pagar, Preparando, A caminho, Finalizado, Cancelado)
- **Comentários e Avaliações**: Classificar produtos com notas e avaliações
- **Autenticação**: Login, cadastro e recuperação de senha
- **Popup WhatsApp**: Chat rápido via WhatsApp diretamente no site

### 👨‍💼 Para Administradores
- **Dashboard Administrativo**: Visão geral de vendas e gestão
- **Gestão de Produtos**: Criar, editar e deletar produtos
- **Upload de Imagens**: Suporte a upload de imagens com fallback em base64
- **Visualização de Pedidos**: Lista completa de pedidos com detalhes
- **Estatísticas**: Gráficos de receita diária e volume de pedidos
- **Exportação de Dados**: Download de pedidos em CSV

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Roteamento**: React Router v7
- **Styling**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Estado**: Context API
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage
- **Notificações**: Sonner (Toast)
- **Pagamento**: PIX (simulado)
- **Gráficos**: Recharts
- **QR Code**: qrcode.js

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ ou superior
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repositório>
cd "Amor e Cacau - Site"
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Abra no navegador**
```
http://localhost:5173
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

O projeto será construído na pasta `dist/`.

### Preview do Build
```bash
npm run preview
```

## 📱 Funcionalidades Detalhadas

### Sistema de Produtos
- Categorias: Doces, Tortas, Bolos, Especiais, Bebidas, Pães
- Tags customizáveis: Novo, Premium, Bestseller
- Rating baseado em avaliações de clientes
- Sistema de favoritos sincronizado

### Carrinho e Checkout
- Cálculo dinâmico de frete baseado em CEP
- Suporte a múltiplos itens
- Integração com Modal de Confirmação de Compra
- Endereço auto-preenchido via CEP

### Minhas Compras
Filtros de status:
- **Tudo**: Todos os pedidos
- **A pagar**: Aguardando pagamento
- **Preparando**: Pedido em preparação
- **A caminho**: Saiu para entrega
- **Finalizado**: Entregue
- **Cancelado**: Pedido cancelado

### Dashboard Admin
- Visão geral com 4 cards de métricas
- Gráficos de receita e volume
- Abas: Pedidos, Produtos, Clientes, Comentários
- Gestão completa de catálogo

## 🔐 Autenticação

- Suporte a signup, signin e recuperação de senha
- Roles: `user` (padrão) e `admin`
- Verificação de email obrigatória
- Reset de senha via link por email

## 📡 Integração com APIs Externas

- **ViaCEP**: Busca de endereço por CEP
- **Supabase**: Backend-as-a-Service (Auth, DB, Storage)
- **WhatsApp**: Links de contato direto

## 🎨 Design System

**Paleta de Cores:**
- Marrom Principal: `#2D160C`
- Dourado/Bege: `#E0B58C`
- Fundo Claro: `#FAF6F0`
- Cinza Texto: `#6B4E3E`

**Tipografia:**
- Font: Serif (títulos) + System Font (corpo)
- Tracking-wide para destaque

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/        # Componentes React reutilizáveis
│   ├── context/          # Context API (Auth, Cart, Products, etc)
│   ├── pages/            # Páginas principais
│   ├── data/             # Dados estáticos
│   ├── utils/            # Utilitários
│   ├── styles/           # CSS global
│   ├── App.tsx           # Componente raiz
│   └── routes.ts         # Configuração de rotas
├── assets/               # Imagens e recursos estáticos
└── main.tsx             # Ponto de entrada
```

## 🔄 Fluxo de Compra

1. Cliente navega no catálogo
2. Adiciona produtos ao carrinho
3. Acessa checkout
4. Preenche endereço (endereço é buscado automaticamente via CEP)
5. Seleciona método de pagamento
6. Confirma pedido
7. Modal de confirmação exibe detalhes
8. Cliente recebe confirmação por email
9. Admin recebe notificação de novo pedido
10. Cliente acompanha em "Minhas Compras"

## 🧪 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Constrói para produção

# Preview
npm run preview      # Visualiza o build localmente

# Type checking
npx tsc --noEmit     # Verifica tipos TypeScript
```

## 📝 Configuração do Supabase

### Tabelas Necessárias

**orders**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- customer_name (text)
- total_amount (numeric)
- shipping_cost (numeric)
- payment_method (text: 'pix' | 'on-delivery')
- items (jsonb)
- address (jsonb)
- status (text: 'Aguardando', 'Preparando', etc)
- created_at (timestamp)
```

**products**
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- price (numeric)
- category (text)
- image (text)
- rating (numeric)
- tags (jsonb array)
- created_at (timestamp)
```

**comments**
```sql
- id (uuid, primary key)
- product_id (uuid)
- user_id (uuid)
- user_name (text)
- comment (text)
- rating (integer: 1-5)
- created_at (timestamp)
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

- **WhatsApp**: [Clique aqui](https://wa.me/5517992598131)
- **Email**: amorecacaurp@gmail.com
- **Endereço**: Rua do Cacau, 123 - Centro, São Paulo, SP

## 🙏 Agradecimentos

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

## 📊 Roadmap

- [ ] Integração com múltiplos métodos de pagamento
- [ ] Sistema de cupons e promoções
- [ ] Rastreamento de entrega em tempo real
- [ ] App mobile nativa
- [ ] Programa de fidelidade
- [ ] Reviews com imagens
- [ ] Sistema de recomendações baseado em IA

---

**Desenvolvido com ❤️ para Amor & Cacau Confeitaria**
"# amor-cacau" 
"# amor-cacau" 
