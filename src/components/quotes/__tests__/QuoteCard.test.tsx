import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuoteCard } from '../QuoteCard';

describe('QuoteCard', () => {
  const mockQuote = {
    id: '123',
    quote_number: 'ORC-001',
    total_amount: 1500.00,
    status: 'pending',
    valid_until: '2025-12-31',
    created_at: '2025-12-27T10:00:00',
    client: {
      name: 'Cliente Teste'
    }
  };

  it('renderiza número do orçamento', () => {
    render(<QuoteCard quote={mockQuote} />);
    expect(screen.getByText('ORC-001')).toBeInTheDocument();
  });

  it('renderiza nome do cliente', () => {
    render(<QuoteCard quote={mockQuote} />);
    expect(screen.getByText('Cliente Teste')).toBeInTheDocument();
  });

  it('renderiza valor total formatado', () => {
    render(<QuoteCard quote={mockQuote} />);
    expect(screen.getByText(/R\$ 1\.500,00/)).toBeInTheDocument();
  });

  it('renderiza status do orçamento', () => {
    render(<QuoteCard quote={mockQuote} />);
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
  });

  it('renderiza data de validade', () => {
    render(<QuoteCard quote={mockQuote} />);
    expect(screen.getByText(/31\/12\/2025/)).toBeInTheDocument();
  });
});
