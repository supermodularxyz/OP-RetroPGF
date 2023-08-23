import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "~/components/ui/Banner";

const meta = {
  title: "UI/Banner",
  component: Banner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      "Only badgeholders are able to vote in RetroPGF. You can find out more about how badgeholders are selected here.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children:
      "Only badgeholders are able to vote in RetroPGF. You can find out more about how badgeholders are selected here.",
  },
};
