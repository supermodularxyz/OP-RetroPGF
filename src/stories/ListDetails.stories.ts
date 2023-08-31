import type { Meta, StoryObj } from "@storybook/react";
import { ListDetails } from "~/components/ListDetails";
import { lists } from "~/data/mock";

const meta = {
  title: "Components/ListDetails",
  component: ListDetails,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ListDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    list: lists[0]!,
  },
};
