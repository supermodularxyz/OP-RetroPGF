import type { Meta, StoryObj } from "@storybook/react";
import { SortBy } from "~/components/SortBy";

const meta = {
  title: "Components/SortBy",
  component: SortBy,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SortBy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "shuffle",
    onChange: () => "",
  },
};
