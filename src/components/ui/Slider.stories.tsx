import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/Slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};
