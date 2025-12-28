import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/ui/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};
