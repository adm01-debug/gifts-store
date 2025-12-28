import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductGrid } from '@/components/products/ProductGrid';

describe('ProductGrid', () => {
  it('renders', () => {
    const { container } = render(<ProductGrid />);
    expect(container).toBeInTheDocument();
  });
});
