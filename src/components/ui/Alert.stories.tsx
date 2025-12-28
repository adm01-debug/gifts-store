import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@/components/ui/Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};
