# 💻 GUIA: Integração Frontend (React)

**Sistema:** Gifts Store - Multi-tenant  
**Data:** 03/01/2025  
**Versão:** 1.0

---

## 🎯 VISÃO GERAL

Este guia mostra como integrar o sistema multi-tenant com Organizations no frontend React/TypeScript.

**Objetivos:**
- ✅ Context de Organization disponível globalmente
- ✅ Hooks customizados para buscar dados
- ✅ Componentes de seleção de org
- ✅ RLS funciona automaticamente

---

## 📋 PRÉ-REQUISITOS

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "react": "^18.x",
    "typescript": "^5.x"
  }
}
```

---

## 🏗️ ESTRUTURA DE PASTAS

```
src/
├── contexts/
│   └── OrganizationContext.tsx
├── hooks/
│   ├── useOrganization.ts
│   ├── useProducts.ts
│   ├── useQuotes.ts
│   └── useOrders.ts
├── components/
│   ├── OrganizationSelector.tsx
│   └── ProtectedRoute.tsx
└── types/
    └── database.types.ts
```

---

## 🔧 PASSO 1: Tipos TypeScript

Crie `src/types/database.types.ts`:

```typescript
// ============================================================
// DATABASE TYPES
// ============================================================

export type OrgRole = 'owner' | 'admin' | 'member';

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface UserOrganization {
  organization_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
  updated_at: string;
}

export interface OrganizationWithRole extends Organization {
  role: OrgRole;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  category_id: string | null;
  base_price: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  organization_id: string;
  client_id: string | null;
  status: string;
  total_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  organization_id: string;
  quote_id: string | null;
  status: string;
  total_amount: number;
  payment_status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

---

## 🎨 PASSO 2: Organization Context

Crie `src/contexts/OrganizationContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { OrganizationWithRole } from '@/types/database.types';

// ============================================================
// TYPES
// ============================================================

interface OrganizationContextType {
  organizations: OrganizationWithRole[];
  currentOrganization: OrganizationWithRole | null;
  isLoading: boolean;
  error: Error | null;
  setCurrentOrganization: (org: OrganizationWithRole) => void;
  refreshOrganizations: () => Promise<void>;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

// ============================================================
// CONTEXT
// ============================================================

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

// ============================================================
// PROVIDER
// ============================================================

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar organizations do usuário
  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setOrganizations([]);
        setCurrentOrganization(null);
        return;
      }

      // Buscar organizations via JOIN
      const { data, error: fetchError } = await supabase
        .from('user_organizations')
        .select(`
          role,
          organizations (
            id,
            name,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const orgs: OrganizationWithRole[] = (data || []).map((item: any) => ({
        id: item.organizations.id,
        name: item.organizations.name,
        created_at: item.organizations.created_at,
        role: item.role,
      }));

      setOrganizations(orgs);

      // Se ainda não tem org selecionada, selecionar a primeira
      if (!currentOrganization && orgs.length > 0) {
        const savedOrgId = localStorage.getItem('currentOrganizationId');
        const savedOrg = orgs.find(o => o.id === savedOrgId);
        setCurrentOrganization(savedOrg || orgs[0]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching organizations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar organizations ao montar
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Salvar org atual no localStorage
  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('currentOrganizationId', currentOrganization.id);
    }
  }, [currentOrganization]);

  // Helpers de role
  const isOwner = currentOrganization?.role === 'owner';
  const isAdmin = currentOrganization?.role === 'admin' || isOwner;
  const isMember = currentOrganization?.role === 'member' || isAdmin;

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        isLoading,
        error,
        setCurrentOrganization,
        refreshOrganizations: fetchOrganizations,
        isOwner,
        isAdmin,
        isMember,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
```

---

## 🪝 PASSO 3: Hooks Customizados

### **Hook de Produtos**

Crie `src/hooks/useProducts.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { Product } from '@/types/database.types';

export function useProducts() {
  const { currentOrganization } = useOrganization();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    fetchProducts();
  }, [currentOrganization]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // RLS cuida de filtrar por organization_id automaticamente!
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (fetchError) throw fetchError;

      setProducts(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentOrganization) throw new Error('No organization selected');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        organization_id: currentOrganization.id,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    setProducts(prev => [...prev, data]);
    return data;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setProducts(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return {
    products,
    isLoading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
```

### **Hook de Orçamentos**

Crie `src/hooks/useQuotes.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { Quote } from '@/types/database.types';

export function useQuotes() {
  const { currentOrganization } = useOrganization();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setQuotes([]);
      setIsLoading(false);
      return;
    }

    fetchQuotes();
  }, [currentOrganization]);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setQuotes(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const createQuote = async (quote: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at'>) => {
    if (!currentOrganization) throw new Error('No organization selected');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('quotes')
      .insert([{
        ...quote,
        organization_id: currentOrganization.id,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    setQuotes(prev => [data, ...prev]);
    return data;
  };

  return {
    quotes,
    isLoading,
    error,
    refresh: fetchQuotes,
    createQuote,
  };
}
```

---

## 🎨 PASSO 4: Componente de Seleção de Org

Crie `src/components/OrganizationSelector.tsx`:

```typescript
import React from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';

export function OrganizationSelector() {
  const { 
    organizations, 
    currentOrganization, 
    setCurrentOrganization,
    isLoading 
  } = useOrganization();

  if (isLoading) {
    return <div>Carregando organizations...</div>;
  }

  if (organizations.length === 0) {
    return (
      <div className="text-red-500">
        Você não pertence a nenhuma organization.
        <br />
        Entre em contato com o administrador.
      </div>
    );
  }

  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{currentOrganization?.name}</span>
        <span className="text-xs text-gray-500">
          ({currentOrganization?.role})
        </span>
      </div>
    );
  }

  return (
    <select
      value={currentOrganization?.id || ''}
      onChange={(e) => {
        const org = organizations.find(o => o.id === e.target.value);
        if (org) setCurrentOrganization(org);
      }}
      className="px-4 py-2 border rounded-lg"
    >
      {organizations.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name} ({org.role})
        </option>
      ))}
    </select>
  );
}
```

---

## 🔒 PASSO 5: Protected Route

Crie `src/components/ProtectedRoute.tsx`:

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { OrgRole } from '@/types/database.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: OrgRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentOrganization, isLoading } = useOrganization();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!currentOrganization) {
    return <Navigate to="/no-organization" replace />;
  }

  if (requiredRole) {
    const roleHierarchy: Record<OrgRole, number> = {
      member: 1,
      admin: 2,
      owner: 3,
    };

    const userLevel = roleHierarchy[currentOrganization.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
```

---

## 🚀 PASSO 6: Setup no App

Atualize `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OrganizationSelector } from '@/components/OrganizationSelector';

// Pages
import { ProductsPage } from '@/pages/ProductsPage';
import { QuotesPage } from '@/pages/QuotesPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  return (
    <OrganizationProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Header com seletor de org */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Gifts Store</h1>
              <OrganizationSelector />
            </div>
          </header>

          {/* Routes */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes - qualquer membro */}
              <Route path="/products" element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/quotes" element={
                <ProtectedRoute>
                  <QuotesPage />
                </ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </OrganizationProvider>
  );
}

export default App;
```

---

## 📦 PASSO 7: Exemplo de Página

Crie `src/pages/ProductsPage.tsx`:

```typescript
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOrganization } from '@/contexts/OrganizationContext';

export function ProductsPage() {
  const { products, isLoading, createProduct } = useProducts();
  const { currentOrganization, isAdmin } = useOrganization();

  if (isLoading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        {isAdmin && (
          <button
            onClick={() => {/* Abrir modal de criar */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Novo Produto
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Organization: {currentOrganization?.name} ({currentOrganization?.role})
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-lg font-bold mt-2">
              R$ {product.base_price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Nenhum produto cadastrado
        </div>
      )}
    </div>
  );
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Types criados (`database.types.ts`)
- [ ] OrganizationContext implementado
- [ ] Hooks customizados criados
- [ ] OrganizationSelector implementado
- [ ] ProtectedRoute implementado
- [ ] App.tsx atualizado
- [ ] Páginas usando os hooks
- [ ] Testado troca de organization
- [ ] Testado permissões por role
- [ ] RLS funcionando (filtro automático)

---

## 🧪 COMO TESTAR

### **1. Teste de Organizations:**

```typescript
// No console do navegador
const { organizations } = useOrganization();
console.log(organizations);
// Deve mostrar apenas as orgs que você participa
```

### **2. Teste de RLS:**

```typescript
// Buscar produtos
const { products } = useProducts();
console.log(products);
// Deve mostrar apenas produtos da org atual
```

### **3. Teste de Permissões:**

```typescript
const { isOwner, isAdmin, isMember } = useOrganization();
console.log({ isOwner, isAdmin, isMember });
// Deve refletir seu role na org atual
```

---

## 📚 PRÓXIMOS PASSOS

1. ✅ Implementar mais hooks (useOrders, useClients, etc)
2. ✅ Criar componentes de CRUD
3. ✅ Adicionar realtime subscriptions
4. ✅ Implementar cache com React Query
5. ✅ Adicionar testes unitários

---

**Autor:** Sistema Gifts Store  
**Versão:** 1.0  
**Data:** 03/01/2025
