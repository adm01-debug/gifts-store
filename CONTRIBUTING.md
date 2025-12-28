# 🤝 Guia de Contribuição - Gifts Store

Obrigado por considerar contribuir! Este documento contém diretrizes para contribuições.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Setup Local](#setup-local)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testes](#testes)

## 🤝 Código de Conduta

- Seja respeitoso e construtivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Seja colaborativo

## 🚀 Como Contribuir

### Reportar Bugs

Use GitHub Issues com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (SO, browser, versão)

### Sugerir Features

Abra uma Issue descrevendo:
- Problema que resolve
- Solução proposta
- Alternativas consideradas
- Mockups/exemplos (opcional)

### Contribuir com Código

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Faça suas mudanças
4. Teste localmente
5. Commit (seguindo padrões)
6. Push (`git push origin feature/MinhaFeature`)
7. Abra um Pull Request

## 🛠️ Setup Local

### Pré-requisitos

```bash
node -v  # 18+
npm -v   # 9+
```

### Instalação

```bash
# Clone seu fork
git clone https://github.com/SEU_USUARIO/gifts-store.git
cd gifts-store

# Adicione upstream
git remote add upstream https://github.com/adm01-debug/gifts-store.git

# Instale dependências
npm install

# Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Rode migrations
npm run migrate

# Inicie dev server
npm run dev
```

## 📝 Padrões de Código

### TypeScript

- **Sempre tipado** - Evite `any`
- **Interfaces claras** - Exporte tipos
- **Props documentadas** - JSDoc quando necessário

```typescript
// ✅ BOM
interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

// ❌ RUIM
function ProductCard(props: any) {}
```

### React

- **Functional components** - Sempre
- **Hooks** - useCallback, useMemo quando apropriado
- **Props destructuring** - Logo no parâmetro

```typescript
// ✅ BOM
export function MyComponent({ title, onClose }: Props) {
  const handleClick = useCallback(() => {
    onClose();
  }, [onClose]);
  
  return <div>{title}</div>;
}
```

### Estilo

- **TailwindCSS** - Classes utilitárias
- **shadcn/ui** - Componentes base
- **Responsive** - Mobile-first

```typescript
// ✅ BOM
<div className="flex flex-col md:flex-row gap-4 p-4">
  <Card className="flex-1">...</Card>
</div>
```

### Nomes

- **Componentes** - PascalCase (`ProductCard.tsx`)
- **Hooks** - camelCase, prefixo `use` (`useProducts.ts`)
- **Utilitários** - camelCase (`formatCurrency.ts`)
- **Constantes** - UPPER_SNAKE_CASE

## 💬 Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

- **feat** - Nova funcionalidade
- **fix** - Correção de bug
- **docs** - Documentação
- **style** - Formatação (não afeta código)
- **refactor** - Refatoração
- **test** - Adicionar/modificar testes
- **chore** - Manutenção

### Exemplos

```bash
feat(quotes): adicionar botão de duplicar orçamento

Implementa funcionalidade de duplicar orçamento existente
com um único clique.

Closes #123
```

```bash
fix(products): corrigir lazy loading de imagens

Images não carregavam corretamente em Safari.
Adicionado polyfill para loading="lazy".
```

## 🔀 Pull Requests

### Checklist

- [ ] Código segue padrões do projeto
- [ ] Testes passam (`npm test`)
- [ ] Linter sem erros (`npm run lint`)
- [ ] Build sem erros (`npm run build`)
- [ ] Documentação atualizada
- [ ] Commits seguem padrão
- [ ] Branch atualizada com `main`

### Template

```markdown
## Descrição
<!-- Descreva as mudanças -->

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
<!-- Passos para testar -->

## Screenshots
<!-- Se aplicável -->

## Checklist
- [ ] Código testado localmente
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
```

## 🧪 Testes

### Rodar Testes

```bash
npm test              # Modo watch
npm run test:ui       # Interface visual
npm run coverage      # Com cobertura
```

### Escrever Testes

```typescript
// ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renderiza nome do produto', () => {
    const product = { id: '1', name: 'Caneta' };
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Caneta')).toBeInTheDocument();
  });
});
```

### Cobertura Mínima

- **Componentes críticos** - 80%
- **Hooks customizados** - 80%
- **Utilitários** - 90%
- **Projeto geral** - 30%+

## 🏗️ Estrutura de Arquivos

```
src/
├── components/
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.test.tsx
│   │   └── index.ts
│   └── ...
├── hooks/
│   ├── useProducts.ts
│   ├── useProducts.test.ts
│   └── index.ts
└── ...
```

## 🎨 UI/UX

- **Acessibilidade** - ARIA labels, navegação por teclado
- **Responsivo** - Mobile, tablet, desktop
- **Dark mode** - Suporte completo
- **Loading states** - Skeletons, spinners
- **Empty states** - Mensagens úteis
- **Erros** - Mensagens claras e acionáveis

## 🚫 O que NÃO fazer

- ❌ Commits direto na `main`
- ❌ PRs gigantes (>500 linhas)
- ❌ Código não testado
- ❌ Hardcoded credentials
- ❌ `console.log` em produção
- ❌ `any` sem justificativa
- ❌ Ignorar linter

## 💡 Dicas

- **Leia issues** antes de começar
- **Pergunte** se não tiver certeza
- **Pequenas mudanças** são melhores
- **Testes primeiro** (TDD quando possível)
- **Documente** decisões complexas

## 📞 Contato

Dúvidas? Abra uma Discussion no GitHub!

---

**Obrigado por contribuir! 🎉**
