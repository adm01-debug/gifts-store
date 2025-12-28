import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@/components/ui/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};
