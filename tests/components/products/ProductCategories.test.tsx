import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductCategories } from '@/components/products/ProductCategories';

describe('ProductCategories', () => {
  it('renders', () => {
    const { container } = render(<ProductCategories />);
    expect(container).toBeInTheDocument();
  });
});
