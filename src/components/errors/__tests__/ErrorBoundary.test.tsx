import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renderiza children quando não há erro', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(container.textContent).toContain('Test Content');
  });
});
