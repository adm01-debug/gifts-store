import { describe, it, expect } from 'vitest';
import { 
  validateCPF, 
  validateCNPJ, 
  formatCPF, 
  formatCNPJ,
  formatPhone,
  formatCEP,
  loginSchema,
  clientSchema
} from '../validations';

describe('validations', () => {
  describe('validateCPF', () => {
    it('valida CPF correto', () => {
      expect(validateCPF('123.456.789-09')).toBe(true);
    });

    it('rejeita CPF inválido', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('123.456.789-00')).toBe(false);
    });

    it('aceita CPF sem formatação', () => {
      expect(validateCPF('12345678909')).toBe(true);
    });
  });

  describe('validateCNPJ', () => {
    it('valida CNPJ correto', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('rejeita CNPJ inválido', () => {
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('formata CPF corretamente', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });
  });

  describe('formatCNPJ', () => {
    it('formata CNPJ corretamente', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });
  });

  describe('formatPhone', () => {
    it('formata telefone celular', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('formata telefone fixo', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });
  });

  describe('formatCEP', () => {
    it('formata CEP corretamente', () => {
      expect(formatCEP('01310100')).toBe('01310-100');
    });
  });

  describe('loginSchema', () => {
    it('valida login correto', () => {
      const result = loginSchema.safeParse({
        email: 'usuario@exemplo.com',
        password: 'senha123'
      });
      
      expect(result.success).toBe(true);
    });

    it('rejeita email inválido', () => {
      const result = loginSchema.safeParse({
        email: 'email-invalido',
        password: 'senha123'
      });
      
      expect(result.success).toBe(false);
    });

    it('rejeita senha curta', () => {
      const result = loginSchema.safeParse({
        email: 'usuario@exemplo.com',
        password: '123'
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe('clientSchema', () => {
    it('valida cliente completo', () => {
      const result = clientSchema.safeParse({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        phone: '(11) 98765-4321',
        document: '123.456.789-09',
        company: 'Empresa Ltda'
      });
      
      expect(result.success).toBe(true);
    });

    it('aceita campos opcionais vazios', () => {
      const result = clientSchema.safeParse({
        name: 'Maria Santos',
        email: '',
        phone: ''
      });
      
      expect(result.success).toBe(true);
    });
  });
});
