import type { Meta, StoryObj } from "@storybook/react";
import { CategoriesFilter } from "~/components/CategoriesFilter";

const meta = {
  title: "Components/CategoriesFilter",
  component: CategoriesFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CategoriesFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: [],
    onSelect: () => "",
    type: "projects",
  },
};
