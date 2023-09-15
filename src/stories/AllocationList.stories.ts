import type { Meta, StoryObj } from "@storybook/react";
import { AllocationList } from "~/components/AllocationList";

import projects from "~/data/projects.json";

const allocations = projects
  .slice(0, 5)
  .map((p, i) => ({ ...p, amount: 1500 + i * 257 }));

const meta = {
  title: "Components/AllocationList",
  component: AllocationList,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof AllocationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    allocations,
  },
};
