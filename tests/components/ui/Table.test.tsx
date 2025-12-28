import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from '@/components/ui/Table';

describe('Table', () => {
  it('renders table with data', () => {
    render(
      <Table>
        <thead><tr><th>Name</th></tr></thead>
        <tbody><tr><td>John</td></tr></tbody>
      </Table>
    );
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
