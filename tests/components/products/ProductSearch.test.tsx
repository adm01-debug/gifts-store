import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductSearch } from '@/components/products/ProductSearch';

describe('ProductSearch', () => {
  it('renders', () => {
    const { container } = render(<ProductSearch />);
    expect(container).toBeInTheDocument();
  });
});
