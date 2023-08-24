import type { Meta, StoryObj } from "@storybook/react";
import { SunnyBanner } from "~/components/SunnyBanner";

const meta = {
  title: "Components/SunnyBanner",
  component: SunnyBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SunnyBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
