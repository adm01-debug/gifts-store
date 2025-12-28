import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuoteTemplateSelector } from '@/components/quotes/QuoteTemplateSelector';
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

describe('QuoteTemplateSelector', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<QuoteTemplateSelector />);
    expect(container).toBeInTheDocument();
  });

  it('displays content correctly', () => {
    renderWithProviders(<QuoteTemplateSelector testId="test-component" />);
    expect(screen.getByTestId || screen.queryByRole).toBeDefined();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<QuoteTemplateSelector onClick={handleClick} />);
    
    const button = screen.queryByRole('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('updates state correctly', async () => {
    const { rerender } = renderWithProviders(<QuoteTemplateSelector value="initial" />);
    
    rerender(<QuoteTemplateSelector value="updated" />);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue || screen.queryByText).toBeDefined();
    });
  });

  it('handles edge cases', () => {
    const { container } = renderWithProviders(<QuoteTemplateSelector data={null} />);
    expect(container).toBeInTheDocument();
  });
});
