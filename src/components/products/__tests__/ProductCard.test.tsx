import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '456',
    name: 'Caneta Personalizada',
    sku: 'CAN-001',
    price: 5.50,
    category: 'Escritório',
    stock_quantity: 100,
    image_url: 'https://example.com/caneta.jpg'
  };

  it('renderiza nome do produto', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Caneta Personalizada')).toBeInTheDocument();
  });

  it('renderiza preço formatado', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/R\$ 5,50/)).toBeInTheDocument();
  });

  it('renderiza categoria', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Escritório')).toBeInTheDocument();
  });

  it('renderiza quantidade em estoque', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('mostra imagem do produto', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProduct.image_url);
  });

  it('emite evento ao clicar', () => {
    const onClick = vi.fn();
    render(<ProductCard product={mockProduct} onClick={onClick} />);
    
    const card = screen.getByText('Caneta Personalizada').closest('div');
    fireEvent.click(card!);
    
    expect(onClick).toHaveBeenCalledWith(mockProduct);
  });
});
