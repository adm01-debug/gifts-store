# 📋 MELHORIAS RESTANTES - GUIA DE IMPLEMENTAÇÃO

## ✅ JÁ CONCLUÍDAS (8/18):
1. ✅ Lazy Loading
2. ✅ Export Excel (infraestrutura)
3. ✅ Duplicar Orçamento (já existia)
4. ✅ QR Code
5. ✅ Tags/Etiquetas
6. ✅ Modo Apresentação
7. ✅ PWA
8. ✅ Rate Limiting

---

## 🔄 PENDENTES (10/18):

### 9. Tokens de Aprovação Seguros
**Arquivos:** `supabase/functions/quote-approval/index.ts`
**Mudanças:**
- Trocar UUID por JWT ou crypto.randomBytes(32)
- Reduzir validade de 7 dias para 48h
- Rate limit de 5 req/min por token
- Registrar IP/user-agent
- Invalidar após uso

### 10. Cache de Busca Semântica
**Arquivos:** `supabase/functions/semantic-search/index.ts`
**Mudanças:**
- Implementar cache com TTL de 5min
- Usar Map() ou Redis
- Invalidar ao atualizar produtos

### 11. Sync Bitrix Assíncrono
**Arquivos:** `supabase/functions/bitrix-sync/index.ts`, `src/hooks/useBitrixSync.ts`
**Mudanças:**
- Criar fila de jobs
- Notificar quando concluído
- Progress bar em tempo real
- Retry automático

### 12. Notificações Push Web
**Arquivos:** `src/hooks/usePushNotifications.ts`, `supabase/functions/send-push/index.ts`
**Mudanças:**
- Web Push API
- Tabela push_subscriptions
- Enviar push para: aprovação, lembrete, conquista

### 13. Audit Log Universal
**Arquivos:** Migration + `src/components/admin/AuditLogViewer.tsx`
**Mudanças:**
- Tabela audit_log
- Trigger em tabelas críticas
- Viewer no admin

### 14. Comentários em Orçamentos
**Arquivos:** Migration + `src/components/quotes/QuoteComments.tsx`
**Mudanças:**
- Tabela quote_comments
- Thread de comentários
- Notificações

### 15. Bulk Actions
**Arquivos:** `src/components/common/BulkActions.tsx`
**Mudanças:**
- Checkbox de seleção
- Barra de ações
- Excluir/Alterar status em massa

### 16. Testes (30% coverage)
**Arquivos:** `vitest.config.ts`, `src/**/*.test.ts`
**Mudanças:**
- Setup Vitest + Testing Library
- Testes de hooks críticos
- CI/CD

### 17. Validação de Formulários
**Arquivos:** QuoteBuilder, Auth, Profile
**Mudanças:**
- Schemas Zod
- Mensagens de erro claras
- Validação client-side

### 18. Error Handling Centralizado
**Arquivos:** `src/components/ErrorBoundary.tsx`, `src/hooks/useErrorHandler.ts`
**Mudanças:**
- Error Boundary global
- Hook useErrorHandler
- Fallback UI
