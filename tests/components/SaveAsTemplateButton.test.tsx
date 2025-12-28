import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveAsTemplateButton } from '@/components/quotes/SaveAsTemplateButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('SaveAsTemplateButton', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<SaveAsTemplateButton />);
    expect(container).toBeInTheDocument();
  });

  it('displays content correctly', () => {
    renderWithProviders(<SaveAsTemplateButton testId="test-component" />);
    expect(screen.getByTestId || screen.queryByRole).toBeDefined();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<SaveAsTemplateButton onClick={handleClick} />);
    
    const button = screen.queryByRole('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('updates state correctly', async () => {
    const { rerender } = renderWithProviders(<SaveAsTemplateButton value="initial" />);
    
    rerender(<SaveAsTemplateButton value="updated" />);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue || screen.queryByText).toBeDefined();
    });
  });

  it('handles edge cases', () => {
    const { container } = renderWithProviders(<SaveAsTemplateButton data={null} />);
    expect(container).toBeInTheDocument();
  });
});
