# 🚀 Guia de Deploy - Gifts Store

Este guia te ajuda a fazer deploy do Gifts Store no Netlify.

## ✅ Pré-requisitos

- [ ] Conta no [Netlify](https://app.netlify.com/)
- [ ] Conta no [Supabase](https://supabase.com/)
- [ ] Credenciais do Supabase (URL + ANON_KEY)

---

## 📋 Passo a Passo - Deploy no Netlify

### 1️⃣ Login no Netlify

1. Acesse: https://app.netlify.com/
2. Faça login com sua conta GitHub
3. Autorize o Netlify a acessar seus repositórios

### 2️⃣ Importar Projeto

1. Clique em **"Add new site"** > **"Import an existing project"**
2. Escolha: **"Deploy with GitHub"**
3. Selecione o repositório: **`adm01-debug/gifts-store`**
4. Configurações detectadas automaticamente:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch**: `main`

### 3️⃣ Configurar Variáveis de Ambiente

**OBRIGATÓRIAS (mínimo para funcionar)**:

No painel do Netlify, vá em: **Site configuration** > **Environment variables**

Adicione estas 3 variáveis:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_APP_URL=https://seu-site.netlify.app
```

#### Como obter as credenciais do Supabase:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 4️⃣ Deploy!

1. Clique em **"Deploy site"**
2. Aguarde 2-5 minutos
3. ✅ Seu site estará disponível em: `https://random-name-123456.netlify.app`

---

## 🔧 Variáveis Opcionais

Adicione conforme necessidade:

### Integrações
```bash
VITE_BITRIX_WEBHOOK=https://promobrindes.bitrix24.com.br/rest/1/webhook
```

### Analytics
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://sentry-dsn@sentry.io/projeto
```

### Pagamentos
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_sua-chave
VITE_MERCADOPAGO_PUBLIC_KEY=sua-chave
```

### WhatsApp Business
```bash
VITE_WHATSAPP_BUSINESS_ID=seu-id
VITE_WHATSAPP_ACCESS_TOKEN=seu-token
```

---

## ✅ Configurações Avançadas

### Domínio Custom

1. **Domain management** > **Add custom domain**
2. Digite: `gifts.seudominio.com.br`
3. Configure DNS (CNAME)
4. SSL configurado automaticamente

### Deploy Previews

✅ Já habilitado! Cada Pull Request terá sua URL de preview.

---

## 🐛 Troubleshooting

### ❌ Build Failed

**Solução**:
1. Verifique logs em: **Deploys** > [último deploy] > **Deploy log**
2. Limpe cache: **Deploys** > **Clear cache and retry**

### ❌ Página em Branco

**Solução**:
1. Abra Console do navegador (F12)
2. Verifique se variáveis de ambiente estão configuradas
3. Especialmente: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### ❌ Erro 404 ao Recarregar

**Solução**:
- ✅ Já resolvido! O `netlify.toml` tem a configuração de redirect

---

## 📞 Suporte

- **Documentação Netlify**: https://docs.netlify.com/
- **Documentação Supabase**: https://supabase.com/docs
- **Documentação Vite**: https://vitejs.dev/

---

## 🎉 Pronto!

Após seguir estes passos, seu site estará no ar! 🚀

**URL temporária**: `https://seu-site.netlify.app`  
**Com domínio custom**: `https://gifts.seudominio.com.br`
