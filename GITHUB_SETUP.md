# GitHub Setup Instructions

## Preparar repositório privado "amor-e-cacau"

Siga estes passos para fazer push do projeto para GitHub:

### 1. Criar repositório no GitHub
- Acesse [github.com/new](https://github.com/new)
- **Repository name**: `amor-e-cacau`
- **Description**: Amor & Cacau - E-commerce platform
- **Visibility**: Private ✓
- Clique em "Create repository"

### 2. Adicionar remote e fazer push (no PowerShell)

```powershell
# Navegar para o projeto
cd "c:\Users\USER\Documents\Amor e Cacau - Site"

# Adicionar remote (SUBSTITUA seu-usuario pelo seu username)
git remote add origin https://github.com/seu-usuario/amor-e-cacau.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push para GitHub
git push -u origin main
```

### 3. Configurar secrets no GitHub (para CI/CD futuro)
- Acesse seu repositório no GitHub
- Settings > Secrets and variables > Actions
- Adicione como "New repository secret":
  - `VITE_SUPABASE_URL` → Seu URL do Supabase
  - `VITE_SUPABASE_ANON_KEY` → Sua chave acessível publicamente

## Verificação pós-push

1. Confirme que todos os arquivos foram enviados
2. Verifique se o `.gitignore` está funcionando (não deve haver `node_modules`, `dist`, `.env.local`)
3. Acesse o repositório para confirmar que está privado

## Próximos passos

- ✅ Projeto otimizado e pronto para produção
- ✅ Git inicializado com historical commits
- ⏳ Aguardando configuração do GitHub
- ⏳ Deploy em Vercel/Netlify/outro (conforme necessário)

## Troubleshooting

**Erro: "fatal: origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/seu-usuario/amor-e-cacau.git
```

**Erro de autenticação**
- Use token pessoal (PAT) ao invés de senha
- Gere em: Settings > Developer settings > Personal access tokens
