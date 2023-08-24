import type { Meta, StoryObj } from "@storybook/react";
import { BallotOverview } from "~/components/BallotOverview";

const meta = {
  title: "Components/BallotOverview",
  component: BallotOverview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BallotOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
