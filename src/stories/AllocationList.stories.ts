import type { Meta, StoryObj } from "@storybook/react";
import { AllocationListSection } from "~/components/AllocationListSection";
import { projects } from "~/data/mock";

const allocations = projects
  .slice(0, 5)
  .map((p, i) => ({ ...p, amount: 1500 + i * 257 }));

const meta = {
  title: "Components/AllocationListSection",
  component: AllocationListSection,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof AllocationListSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    allocations,
  },
};
