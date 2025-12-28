import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@/components/ui/Form';

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {};
