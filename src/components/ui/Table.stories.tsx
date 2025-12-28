import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '@/components/ui/Table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {};
