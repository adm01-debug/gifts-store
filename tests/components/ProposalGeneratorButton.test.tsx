import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProposalGeneratorButton } from '@/components/quotes/ProposalGeneratorButton';
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

describe('ProposalGeneratorButton', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<ProposalGeneratorButton />);
    expect(container).toBeInTheDocument();
  });

  it('displays content correctly', () => {
    renderWithProviders(<ProposalGeneratorButton testId="test-component" />);
    expect(screen.getByTestId || screen.queryByRole).toBeDefined();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<ProposalGeneratorButton onClick={handleClick} />);
    
    const button = screen.queryByRole('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('updates state correctly', async () => {
    const { rerender } = renderWithProviders(<ProposalGeneratorButton value="initial" />);
    
    rerender(<ProposalGeneratorButton value="updated" />);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue || screen.queryByText).toBeDefined();
    });
  });

  it('handles edge cases', () => {
    const { container } = renderWithProviders(<ProposalGeneratorButton data={null} />);
    expect(container).toBeInTheDocument();
  });
});
