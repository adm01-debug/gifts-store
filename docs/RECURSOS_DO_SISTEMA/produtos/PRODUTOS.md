# Serviço de Produtos

## Visão Geral

O serviço de produtos é responsável por toda a lógica de negócio relacionada ao catálogo de produtos da Gifts Store. Ele abstrai a comunicação com o Supabase e fornece uma API limpa para os componentes React.

## Arquitetura

```
src/
├── services/
│   └── productService.ts      # Serviço principal (lógica de negócio)
├── hooks/
│   └── useProductsCatalog.ts  # Hooks React Query (estado e cache)
└── data/
    └── mockData.ts            # Dados mockados (referência/fallback)
```

## Serviço Principal

**Arquivo:** `src/services/productService.ts`

### Tipos Principais

| Tipo | Descrição |
|------|-----------|
| `Product` | Interface completa do produto (76 campos) |
| `ProductFilters` | Filtros de busca (categoria, preço, estoque, etc.) |
| `ProductPagination` | Configuração de paginação e ordenação |
| `PaginatedProductsResponse` | Resposta paginada com metadata |

### Métodos Disponíveis

| Método | Descrição | Retorno |
|--------|-----------|---------|
| `getProducts(filters?, pagination?)` | Lista produtos com filtros | `PaginatedProductsResponse` |
| `getProductById(id)` | Busca produto por ID | `Product \| null` |
| `getProductBySku(sku)` | Busca produto por SKU | `Product \| null` |
| `getFeaturedProducts(limit?)` | Produtos em destaque | `Product[]` |
| `getNewProducts(limit?)` | Novidades | `Product[]` |
| `getRelatedProducts(productId, limit?)` | Produtos relacionados | `Product[]` |
| `getCategories()` | Lista categorias | `Category[]` |
| `getSuppliers()` | Lista fornecedores | `Supplier[]` |
| `getProductStats()` | Estatísticas do catálogo | `ProductStats` |
| `incrementViewCount(id)` | Incrementa visualizações | `void` |
| `incrementFavoriteCount(id)` | Incrementa favoritos | `void` |
| `decrementFavoriteCount(id)` | Decrementa favoritos | `void` |

### Exemplo de Uso

```typescript
import { productService } from '@/services/productService';

// Buscar produtos com filtros
const result = await productService.getProducts(
  { category_id: 'xxx', min_price: 10-00, in_stock: true },
  { page: 1, page_size: 20, order_by: 'name' }
);

// Buscar produto específico
const product = await productService.getProductById('product-uuid');

// Buscar destaques
const featured = await productService.getFeaturedProducts(8);
```

## Hooks React Query

**Arquivo:** `src/hooks/useProductsCatalog.ts`

### Hooks Disponíveis

| Hook | Descrição |
|------|-----------|
| `useProductsCatalog(filters?, pagination?)` | Lista paginada com cache |
| `useProductDetail(id)` | Detalhes do produto |
| `useProductBySku(sku)` | Busca por SKU |
| `useFeaturedProducts(limit?)` | Produtos destaque |
| `useNewProducts(limit?)` | Novidades |
| `useRelatedProducts(productId, limit?)` | Relacionados |
| `useProductCategories()` | Categorias |
| `useProductSuppliers()` | Fornecedores |
| `useProductStats()` | Estatísticas |
| `useToggleFavoriteCount()` | Mutation para favoritar |

### Exemplo de Uso em Componente

```tsx
import { useProductsCatalog, useProductCategories } from '@/hooks/useProductsCatalog';

function ProductList() {
  const { data, isLoading, error } = useProductsCatalog(
    { is_featured: true },
    { page: 1, page_size: 12 }
  );

  const { data: categories } = useProductCategories();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Estrutura do Produto (76 campos)

### Identificação
- `id`, `name`, `description`, `short_description`, `sku`, `sku_promo`

### Categorização
- `category_id`, `main_category_id`, `supplier_id`, `brand`

### Preços
- `cost_price`, `sale_price`, `base_price`, `suggested_price`

### Estoque
- `stock_quantity`, `min_stock`, `minimum_stock`, `stock_unit`, `min_quantity`, `is_stockout`

### Mídia
- `image_url`, `primary_image_url`, `images` (JSONB), `videos` (JSONB)

### Dimensões
- `weight`, `dimensions`, `box_length_mm`, `box_width_mm`, `box_height_mm`, `box_weight_kg`, `product_weight_g`

### Personalização
- `allows_personalization`, `personalization_options`, `personalization_areas`

### Variações
- `colors`, `sizes`, `materials`, `has_colors`, `has_sizes`, `has_capacity`, `combined_sizes`, `gender`

### Tags e SEO
- `tags`, `meta_title`, `meta_description`, `meta_keywords`

### Flags
- `is_featured`, `is_new`, `is_on_sale`, `is_bestseller`, `is_kit`, `is_textil`, `is_online_exclusive`

### Métricas
- `view_count`, `favorite_count`, `order_count`, `catalog_page`

### Códigos Fiscais
- `ean`, `gtin`, `ncm_code`, `origin_country`, `warranty_months`, `manufacturer_sku`, `supplier_reference`

### Multi-tenant
- `organization_id`, `product_type`, `is_active`, `is_deleted`, `deleted_at`

### Auditoria
- `created_at`, `updated_at`, `created_by`, `updated_by`, `last_cost_update_at`, `last_stock_update_at`

## Dependências

- `@supabase/supabase-js` - Cliente Supabase
- `@tanstack/react-query` - Gerenciamento de estado assíncrono

## Próximos Passos

1. [ ] Executar migration no Supabase Cloud
2. [ ] Popular dados de seed
3. [ ] Conectar `Index.tsx` ao `useProductsCatalog`
4. [ ] Implementar filtros server-side
5. [ ] Adicionar busca full-text com pg_trgm
