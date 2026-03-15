# Guia de Deploy — SellAI

Deploy 100% gratuito usando Vercel + Supabase + Google AI Studio.
Tempo estimado: 20-30 minutos.

---

## Prerequisitos

- Conta no GitHub (gratuita)
- Conta no Supabase (gratuita) — supabase.com
- Conta no Vercel (gratuita) — vercel.com
- Conta no Google AI Studio (gratuita) — aistudio.google.com

---

## Passo 1 — Configurar o Supabase

1. Acesse https://supabase.com e crie um novo projeto
2. Escolha uma senha forte para o banco de dados e salve
3. Aguarde o projeto ser criado (1-2 minutos)

### Executar o schema do banco

1. No menu lateral, clique em "SQL Editor"
2. Clique em "New query"
3. Copie todo o conteudo do arquivo `supabase/schema.sql`
4. Cole no editor e clique em "Run"
5. Confirme que nao ha erros na saida

### Configurar autenticacao

1. Va em Authentication > Providers
2. "Email" ja vem ativo por padrao — mantenha assim
3. Opcional: em Authentication > URL Configuration, adicione:
   - Site URL: `https://seu-app.vercel.app`
   - Redirect URLs: `https://seu-app.vercel.app/**`

### Pegar as credenciais

1. Va em Project Settings > API
2. Copie:
   - "Project URL" (NEXT_PUBLIC_SUPABASE_URL)
   - "anon public" key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## Passo 2 — Obter a chave da API do Gemini (GRATIS)

1. Acesse https://aistudio.google.com/app/apikey
2. Clique em "Create API key"
3. Selecione um projeto Google Cloud ou crie um novo
4. Copie a chave gerada (GEMINI_API_KEY)

**Nota sobre limites gratuitos do Gemini 2.0 Flash:**
- 15 requests por minuto
- 1.500 requests por dia
- 1 milhao de tokens por minuto
Suficiente para uma equipe pequena sem custo algum.

---

## Passo 3 — Deploy na Vercel

### Opcao A — Via GitHub (recomendado)

1. Crie um repositorio no GitHub e faca push do projeto:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/social-selling-app.git
   git push -u origin main
   ```

2. Acesse https://vercel.com e clique em "Add New Project"
3. Importe o repositorio que acabou de criar
4. Na tela de configuracao, adicione as variaveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua anon key do Supabase
   - `GEMINI_API_KEY` = sua chave do Google AI Studio
5. Clique em "Deploy"
6. Aguarde 2-3 minutos

### Opcao B — Via Vercel CLI

```bash
npm i -g vercel
vercel
# Siga as instrucoes interativas
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GEMINI_API_KEY
vercel --prod
```

---

## Passo 4 — Testar o deploy

1. Acesse a URL gerada pela Vercel (ex: `https://social-selling-app.vercel.app`)
2. Crie uma conta de teste
3. Confirme o email (verifique a caixa de entrada)
4. Faca login e teste o upload de uma imagem

---

## Desenvolvimento local

1. Clone o repositorio
2. Copie o arquivo de exemplo:
   ```
   cp .env.local.example .env.local
   ```
3. Preencha as variaveis no `.env.local`
4. Instale as dependencias:
   ```
   npm install
   ```
5. Inicie o servidor:
   ```
   npm run dev
   ```
6. Acesse http://localhost:3000

---

## Limites dos tiers gratuitos

| Servico | Limite gratuito |
|---------|----------------|
| Vercel | 100GB bandwidth/mes, deploys ilimitados |
| Supabase | 500MB banco, 1GB storage, 50.000 usuarios |
| Gemini API | 1.500 requests/dia, 15 req/min |

Para uma equipe de ate 50 pessoas com uso moderado, esses limites sao mais que suficientes sem qualquer custo.

---

## Adicionar novos scripts

Edite o arquivo `src/app/(dashboard)/scripts/page.tsx` e adicione novos objetos ao array `SCRIPTS` seguindo o mesmo padrao dos existentes.

## Personalizar o prompt da IA

Edite o arquivo `src/lib/gemini.ts` e modifique a constante `PROMPT_SOCIAL_SELLING` para ajustar o comportamento da IA ao seu produto/servico especifico.
