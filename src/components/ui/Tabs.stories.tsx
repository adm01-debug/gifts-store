import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/ui/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};
