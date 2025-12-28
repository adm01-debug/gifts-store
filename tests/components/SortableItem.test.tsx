import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SortableItem } from '@/components/common/SortableItem';

describe('SortableItem', () => {
  it('renders', () => {
    const { container } = render(<SortableItem />);
    expect(container).toBeTruthy();
  });
});
