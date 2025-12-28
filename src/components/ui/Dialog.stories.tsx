import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@/components/ui/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};
