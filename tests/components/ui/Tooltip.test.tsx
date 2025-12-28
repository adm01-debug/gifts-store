import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from '@/components/ui/Tooltip';

describe('Tooltip', () => {
  it('shows on hover', async () => {
    render(<Tooltip content="Tooltip text"><button>Hover</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(await screen.findByText('Tooltip text')).toBeInTheDocument();
  });
});
