import type { Meta, StoryObj } from "@storybook/react";
import { SortBy } from "~/components/SortBy";
import { type Filter } from "~/hooks/useFilter";

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

const options = ["shuffle", "asc", "desc"] as Filter["sort"][];

export const Default: Story = {
  args: {
    options,
    value: "shuffle",
    onChange: () => "",
  },
};
