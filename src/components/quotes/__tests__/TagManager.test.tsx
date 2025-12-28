import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagManager } from '../TagManager';

describe('TagManager', () => {
  it('renderiza tags fornecidas', () => {
    render(<TagManager tags={['urgente', 'vip']} onChange={() => {}} />);
    expect(screen.getByText('urgente')).toBeInTheDocument();
    expect(screen.getByText('vip')).toBeInTheDocument();
  });
});
