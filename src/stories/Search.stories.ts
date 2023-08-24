import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { Search } from "~/components/Search";

const meta = {
  title: "Components/Search",
  component: Search,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// // More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
// export const LoggedIn: Story = {
//   // play: async ({ canvasElement }) => {
//   //   const canvas = within(canvasElement);
//   //   const loginButton = await canvas.getByRole('button', {
//   //     name: /Log in/i,
//   //   });
//   //   await userEvent.click(loginButton);
//   // },
// };
