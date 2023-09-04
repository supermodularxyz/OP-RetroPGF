import type { Meta, StoryObj } from "@storybook/react";
import { ProjectImage } from "~/components/ui/ProjectImage";

const meta = {
  title: "UI/ProjectImage",
  component: ProjectImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof ProjectImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatarUrl: "https://picsum.photos/200",
  },
};

export const Small: Story = {
  args: {
    small: true,
    avatarUrl: "https://picsum.photos/200",
  },
};


