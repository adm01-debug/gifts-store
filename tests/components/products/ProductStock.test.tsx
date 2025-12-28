import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductStock } from '@/components/products/ProductStock';

describe('ProductStock', () => {
  it('renders', () => {
    const { container } = render(<ProductStock />);
    expect(container).toBeInTheDocument();
  });
});
