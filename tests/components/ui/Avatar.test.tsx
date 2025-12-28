import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  it('renders image', () => {
    render(<Avatar src="/avatar.jpg" alt="User" />);
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });
  
  it('shows initials fallback', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
