import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageUploadButton } from '@/components/common/ImageUploadButton';

describe('ImageUploadButton', () => {
  it('renders', () => {
    const { container } = render(<ImageUploadButton />);
    expect(container).toBeTruthy();
  });
});
