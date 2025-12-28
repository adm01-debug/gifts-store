import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClientCard } from '../ClientCard';

describe('ClientCard', () => {
  const client = { id: '1', name: 'Empresa ABC', email: 'abc@example.com' };
  it('renderiza nome', () => {
    render(<ClientCard client={client} />);
    expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
  });
});
