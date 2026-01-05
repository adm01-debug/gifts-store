# 🔀 Guia de Workflow Git - Washington & Joaquim

## 📋 Estrutura de Branches

```
main (PRODUÇÃO - NUNCA editar diretamente!)
 │
 ├── washington (branch do Washington)
 │
 └── joaquim (branch do Joaquim)
```

---

## 🚨 REGRAS DE OURO (NUNCA QUEBRAR!)

| ❌ PROIBIDO | ✅ CORRETO |
|-------------|-----------|
| `git push --force` | `git push` (normal) |
| Editar direto na `main` | Editar na SUA branch |
| `git reset --hard` sem backup | Fazer backup antes |
| Push sem pull antes | SEMPRE pull antes de push |

---

## 👤 WASHINGTON - Workflow Diário

### 1. COMEÇAR O DIA (antes de codar)
```bash
# Ir para sua branch
git checkout washington

# Pegar atualizações do servidor
git pull origin washington

# Pegar atualizações da main (importante!)
git pull origin main
```

### 2. DURANTE O TRABALHO
```bash
# Salvar progresso frequentemente
git add .
git commit -m "descrição do que fez"
```

### 3. FIM DO DIA (antes de fechar)
```bash
# Enviar seu trabalho para o servidor
git pull origin washington    # Pegar novidades
git push origin washington    # Enviar seu trabalho
```

### 4. QUANDO QUISER ENVIAR PARA PRODUÇÃO (main)
```bash
# 1. Garantir que está atualizado
git checkout washington
git pull origin washington
git pull origin main

# 2. Resolver conflitos se houver

# 3. Ir para a main e fazer merge
git checkout main
git pull origin main
git merge washington

# 4. Enviar para produção
git push origin main

# 5. Voltar para sua branch
git checkout washington
```

---

## 👤 JOAQUIM - Workflow Diário

### 1. COMEÇAR O DIA (antes de codar)
```bash
# Ir para sua branch
git checkout joaquim

# Pegar atualizações do servidor
git pull origin joaquim

# Pegar atualizações da main (importante!)
git pull origin main
```

### 2. DURANTE O TRABALHO
```bash
# Salvar progresso frequentemente
git add .
git commit -m "descrição do que fez"
```

### 3. FIM DO DIA (antes de fechar)
```bash
# Enviar seu trabalho para o servidor
git pull origin joaquim    # Pegar novidades
git push origin joaquim    # Enviar seu trabalho
```

### 4. QUANDO QUISER ENVIAR PARA PRODUÇÃO (main)
```bash
# 1. Garantir que está atualizado
git checkout joaquim
git pull origin joaquim
git pull origin main

# 2. Resolver conflitos se houver

# 3. Ir para a main e fazer merge
git checkout main
git pull origin main
git merge joaquim

# 4. Enviar para produção
git push origin main

# 5. Voltar para sua branch
git checkout joaquim
```

---

## ⚠️ COMO RESOLVER CONFLITOS

Se aparecer "CONFLICT" após um pull ou merge:

### 1. Ver quais arquivos têm conflito
```bash
git status
```

### 2. Abrir cada arquivo com conflito
Procure por marcações assim:
```
<<<<<<< HEAD
Código da sua versão
=======
Código da outra versão
>>>>>>> origin/main
```

### 3. Resolver manualmente
Escolha qual código manter (ou combine os dois) e **remova as marcações** `<<<<<<<`, `=======`, `>>>>>>>`

### 4. Salvar a resolução
```bash
git add .
git commit -m "Resolve conflitos"
```

---

## 🆘 COMANDOS DE EMERGÊNCIA

### "Fiz cagada e não dei commit ainda"
```bash
git checkout -- .          # Descarta todas alterações não commitadas
git checkout -- arquivo.ts # Descarta alteração de um arquivo específico
```

### "Fiz commit errado mas não dei push"
```bash
git reset --soft HEAD~1    # Volta o commit mas mantém os arquivos
```

### "Quero ver o que mudou antes de dar push"
```bash
git diff origin/washington # Washington
git diff origin/joaquim    # Joaquim
```

### "Quero ver histórico de commits"
```bash
git log --oneline -10
```

---

## 📱 RESUMO RÁPIDO

### Washington
```bash
git checkout washington
git pull origin washington
git pull origin main
# ... trabalha ...
git add .
git commit -m "mensagem"
git push origin washington
```

### Joaquim
```bash
git checkout joaquim
git pull origin joaquim
git pull origin main
# ... trabalha ...
git add .
git commit -m "mensagem"
git push origin joaquim
```

---

## ❓ FAQ

**P: Posso editar o mesmo arquivo que o outro?**
R: Sim, mas pode gerar conflito. Combinem quem edita o quê.

**P: Se eu fizer push, apago o trabalho do outro?**
R: NÃO, se cada um usar sua branch. Por isso existem as branches separadas.

**P: Quando devo fazer merge na main?**
R: Quando sua funcionalidade estiver pronta e testada.

**P: E se eu der push --force?**
R: NUNCA faça isso. Pode apagar o trabalho de todos.
