import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/ui/Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
