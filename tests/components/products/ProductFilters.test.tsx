import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductFilters } from '@/components/products/ProductFilters';

describe('ProductFilters', () => {
  it('renders', () => {
    const { container } = render(<ProductFilters />);
    expect(container).toBeInTheDocument();
  });
});
