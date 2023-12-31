import type { Meta, StoryObj } from "@storybook/react";
import { BallotConfirmation } from "~/components/BallotConfirmation";

import projects from "~/data/projects.json";

const meta = {
  title: "Components/BallotConfirmation",
  component: BallotConfirmation,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof BallotConfirmation>;

const allocations = projects
  .slice(0, 5)
  .map((p, i) => ({ projectId: p.id, amount: 1500 + i * 257 }));

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    allocations,
  },
};
