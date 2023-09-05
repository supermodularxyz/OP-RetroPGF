import type { Meta, StoryObj } from "@storybook/react";
import { BallotConfirmation } from "~/components/BallotConfirmation";

const meta = {
  title: "Components/BallotConfirmation",
  component: BallotConfirmation,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof BallotConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
