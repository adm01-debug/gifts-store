import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';

describe('ProductCard', () => {
  it('renders', () => {
    const { container } = render(<ProductCard />);
    expect(container).toBeInTheDocument();
  });
});
