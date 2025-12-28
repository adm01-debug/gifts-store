import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductGroupsManager } from '@/components/admin/ProductGroupsManager';

describe('ProductGroupsManager', () => {
  it('renders', () => {
    const { container } = render(<ProductGroupsManager />);
    expect(container).toBeTruthy();
  });
});
