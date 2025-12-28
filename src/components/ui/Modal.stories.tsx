import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@/components/ui/Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {};
