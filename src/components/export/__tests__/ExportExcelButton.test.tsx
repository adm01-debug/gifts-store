import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExportExcelButton } from '../ExportExcelButton';

describe('ExportExcelButton', () => {
  it('renderiza botão de exportar', () => {
    render(
      <ExportExcelButton data={[]} filename="test" sheetName="Test" />
    );
    expect(screen.getByText(/exportar/i)).toBeInTheDocument();
  });
});
