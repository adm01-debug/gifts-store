import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InlineEditField } from '@/components/common/InlineEditField';

describe('InlineEditField', () => {
  it('renders', () => {
    const { container } = render(<InlineEditField />);
    expect(container).toBeTruthy();
  });
});
