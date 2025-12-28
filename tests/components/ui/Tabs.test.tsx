import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '@/components/ui/Tabs';

describe('Tabs', () => {
  it('switches tabs', () => {
    render(
      <Tabs>
        <Tabs.Tab label="Tab 1">Content 1</Tabs.Tab>
        <Tabs.Tab label="Tab 2">Content 2</Tabs.Tab>
      </Tabs>
    );
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeVisible();
  });
});
