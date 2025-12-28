import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductList } from '@/components/products/ProductList';

describe('ProductList', () => {
  it('renders', () => {
    const { container } = render(<ProductList />);
    expect(container).toBeInTheDocument();
  });
});
