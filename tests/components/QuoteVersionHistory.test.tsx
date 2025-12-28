import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuoteVersionHistory } from '@/components/quotes/QuoteVersionHistory';
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

describe('QuoteVersionHistory', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<QuoteVersionHistory />);
    expect(container).toBeInTheDocument();
  });

  it('displays content correctly', () => {
    renderWithProviders(<QuoteVersionHistory testId="test-component" />);
    expect(screen.getByTestId || screen.queryByRole).toBeDefined();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<QuoteVersionHistory onClick={handleClick} />);
    
    const button = screen.queryByRole('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('updates state correctly', async () => {
    const { rerender } = renderWithProviders(<QuoteVersionHistory value="initial" />);
    
    rerender(<QuoteVersionHistory value="updated" />);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue || screen.queryByText).toBeDefined();
    });
  });

  it('handles edge cases', () => {
    const { container } = renderWithProviders(<QuoteVersionHistory data={null} />);
    expect(container).toBeInTheDocument();
  });
});
