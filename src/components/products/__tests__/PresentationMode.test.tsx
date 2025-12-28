import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresentationMode } from '../PresentationMode';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 10 },
  { id: '2', name: 'Product 2', price: 20 }
];

describe('PresentationMode', () => {
  it('renderiza produtos em modo apresentação', () => {
    render(
      <PresentationMode 
        products={mockProducts} 
        onClose={() => {}} 
      />
    );
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('navega entre produtos', () => {
    render(
      <PresentationMode 
        products={mockProducts} 
        onClose={() => {}} 
      />
    );
    
    // Simular navegação com seta
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    // Verificar navegação
  });

  it('fecha com ESC', () => {
    const onClose = vi.fn();
    render(
      <PresentationMode 
        products={mockProducts} 
        onClose={onClose} 
      />
    );
    
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
