import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders and accepts input', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(onChange).toHaveBeenCalled();
  });
  
  it('shows error state', () => {
    render(<Input error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
