import type { Meta, StoryObj } from "@storybook/react";
import { SortByDropdown } from "~/components/SortByDropdown";
import { type Filter } from "~/hooks/useFilter";

const meta = {
  title: "Components/SortByDropdown",
  component: SortByDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SortByDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = ["shuffle", "asc", "desc"] as Filter["sort"][];

export const Default: Story = {
  args: {
    options,
    value: "shuffle",
    onChange: () => "",
  },
};
