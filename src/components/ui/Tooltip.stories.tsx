import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/ui/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
