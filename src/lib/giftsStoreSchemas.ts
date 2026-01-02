import { z } from 'zod';

export const produtoGiftSchema = z.object({
  codigo: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  categoria_id: z.string().uuid().optional(),
  preco: z.coerce.number().positive(),
  preco_promocional: z.coerce.number().positive().optional(),
  estoque: z.coerce.number().int().min(0).default(0),
  ativo: z.coerce.boolean().default(true),
  destaque: z.coerce.boolean().default(false),
  imagem_url: z.string().url().optional(),
});

export const pedidoGiftSchema = z.object({
  numero: z.string().min(1),
  cliente_id: z.string().uuid().optional(),
  cliente_nome: z.string().optional(),
  cliente_email: z.string().email().optional(),
  valor_total: z.coerce.number().positive(),
  status: z.enum(['novo', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado']).default('novo'),
  forma_pagamento: z.string().optional(),
  endereco_entrega: z.string().optional(),
});

export const giftsStoreImportTemplates = {
  produtos: [
    { key: 'codigo', label: 'Código', example: 'GIFT-001' },
    { key: 'nome', label: 'Nome', example: 'Caneca Personalizada' },
    { key: 'preco', label: 'Preço', example: '35.90' },
    { key: 'estoque', label: 'Estoque', example: '100' },
  ],
};

export const giftsStoreFilterConfigs = {
  produtos: [
    { key: 'ativo', label: 'Status', type: 'select' as const, options: [{ value: 'true', label: 'Ativo' }, { value: 'false', label: 'Inativo' }] },
    { key: 'destaque', label: 'Destaque', type: 'select' as const, options: [{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }] },
  ],
  pedidos: [
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'novo', label: 'Novo' },
      { value: 'pago', label: 'Pago' },
      { value: 'em_separacao', label: 'Em Separação' },
      { value: 'enviado', label: 'Enviado' },
      { value: 'entregue', label: 'Entregue' },
    ]},
  ],
};
