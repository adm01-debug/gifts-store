// src/lib/validations/index.ts

import { z } from 'zod';

// ========================================
// SCHEMAS DE AUTENTICAÇÃO
// ========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// ========================================
// SCHEMAS DE PERFIL
// ========================================

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido (formato: (11) 98765-4321)')
    .optional()
    .or(z.literal('')),
  department: z.string().optional(),
  position: z.string().optional()
});

// ========================================
// SCHEMAS DE CLIENTES
// ========================================

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const clientSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome muito longo'),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  document: z
    .string()
    .refine(
      (val) => !val || cpfRegex.test(val) || cnpjRegex.test(val),
      'CPF ou CNPJ inválido'
    )
    .optional(),
  company: z.string().max(200).optional(),
  segment: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().length(2, 'UF deve ter 2 letras').optional(),
  address_zipcode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'CEP inválido (formato: 12345-678)')
    .optional()
    .or(z.literal(''))
});

// ========================================
// SCHEMAS DE ORÇAMENTOS
// ========================================

export const quoteItemSchema = z.object({
  product_id: z.string().uuid('Produto inválido'),
  quantity: z
    .number()
    .int('Quantidade deve ser inteira')
    .positive('Quantidade deve ser positiva')
    .min(1, 'Quantidade mínima é 1'),
  unit_price: z
    .number()
    .nonnegative('Preço não pode ser negativo'),
  discount: z
    .number()
    .min(0, 'Desconto não pode ser negativo')
    .max(100, 'Desconto máximo é 100%')
    .default(0),
  personalization: z.object({
    technique: z.string().optional(),
    colors: z.array(z.string()).optional(),
    logo_url: z.string().url('URL inválida').optional(),
    notes: z.string().optional()
  }).optional()
});

export const quoteSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  valid_until: z
    .date()
    .min(new Date(), 'Data de validade deve ser futura'),
  items: z
    .array(quoteItemSchema)
    .min(1, 'Adicione pelo menos um item'),
  notes: z.string().max(1000, 'Notas muito longas').optional(),
  payment_terms: z.string().optional(),
  delivery_terms: z.string().optional(),
  shipping_cost: z
    .number()
    .nonnegative('Frete não pode ser negativo')
    .optional(),
  tags: z
    .array(z.string())
    .max(10, 'Máximo de 10 tags')
    .optional()
});

// ========================================
// SCHEMAS DE METAS
// ========================================

export const salesGoalSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(100, 'Título muito longo'),
  target_amount: z
    .number()
    .positive('Meta deve ser positiva')
    .max(10000000, 'Meta muito alta'),
  deadline: z
    .date()
    .min(new Date(), 'Data limite deve ser futura'),
  category: z.enum(['revenue', 'quotes', 'clients']),
  description: z.string().max(500).optional()
});

// ========================================
// SCHEMAS DE LEMBRETES
// ========================================

export const reminderSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  quote_id: z.string().uuid('Orçamento inválido').optional(),
  reminder_date: z
    .date()
    .min(new Date(), 'Data do lembrete deve ser futura'),
  message: z
    .string()
    .min(10, 'Mensagem muito curta')
    .max(500, 'Mensagem muito longa'),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

// ========================================
// SCHEMAS DE PRODUTOS
// ========================================

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minQuantity: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional()
}).refine(
  (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  { message: 'Preço mínimo deve ser menor que o máximo', path: ['maxPrice'] }
);

// ========================================
// TIPOS TYPESCRIPT
// ========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
export type SalesGoalInput = z.infer<typeof salesGoalSchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;

// ========================================
// HELPERS DE VALIDAÇÃO
// ========================================

export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cpf[10]);
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
}

export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatPhone(phone: string): string {
  phone = phone.replace(/[^\d]/g, '');
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function formatCEP(cep: string): string {
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
