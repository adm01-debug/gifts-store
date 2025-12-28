import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductDetails } from '@/components/products/ProductDetails';

describe('ProductDetails', () => {
  it('renders', () => {
    const { container } = render(<ProductDetails />);
    expect(container).toBeInTheDocument();
  });
});
