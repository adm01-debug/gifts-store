import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@/components/ui/Radio';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {};
