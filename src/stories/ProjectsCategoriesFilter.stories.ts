import type { Meta, StoryObj } from "@storybook/react";
import { ProjectsCategoriesFilter } from "~/components/ProjectsCategoriesFilter";

const meta = {
  title: "Components/ProjectsCategoriesFilter",
  component: ProjectsCategoriesFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProjectsCategoriesFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: [],
    onSelect: () => "",
  },
};
