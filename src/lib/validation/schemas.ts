import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  description: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
});

export const quoteSchema = z.object({
  clientId: z.number().int().positive(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});
