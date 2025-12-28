import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QuoteQRCode } from '../QuoteQRCode';

describe('QuoteQRCode', () => {
  it('renderiza QR Code', () => {
    const { container } = render(
      <QuoteQRCode quoteId="123" quoteNumber="ORC-001" />
    );
    expect(container.querySelector('canvas, svg')).toBeTruthy();
  });
});
