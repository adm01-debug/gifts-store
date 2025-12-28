import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProductSort } from '@/components/products/ProductSort';

describe('ProductSort', () => {
  it('renders', () => {
    const { container } = render(<ProductSort />);
    expect(container).toBeInTheDocument();
  });
});
