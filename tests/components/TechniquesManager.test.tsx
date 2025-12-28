import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TechniquesManager } from '@/components/admin/TechniquesManager';

describe('TechniquesManager', () => {
  it('renders', () => {
    const { container } = render(<TechniquesManager />);
    expect(container).toBeTruthy();
  });
});
