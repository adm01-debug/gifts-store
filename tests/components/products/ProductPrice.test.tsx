import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductPrice } from '@/components/products/ProductPrice';

describe('ProductPrice', () => {
  it('renders', () => {
    const { container } = render(<ProductPrice />);
    expect(container).toBeInTheDocument();
  });
});
