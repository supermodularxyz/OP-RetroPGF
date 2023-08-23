import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "~/components/ui/Tag";

const meta = {
  title: "UI/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Tag",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Tag",
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: "Tag",
  },
};
