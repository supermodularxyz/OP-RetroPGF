import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { Lists } from "~/components/Lists";
import { lists } from "~/data/mock";
import { initialFilter } from "~/hooks/useFilter";

const meta = {
  title: "Components/Lists",
  component: Lists,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Lists>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filter: initialFilter,
    lists: lists.slice(0, 6),
  },
};

export const Like: Story = {
  args: {
    filter: initialFilter,
    lists: lists.slice(0, 1),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Like", async () => {
      await userEvent.click(canvas.getByTestId('like-btn'));
      // TODO: complete this after adding like functionality
    });
  },
};



// TODO: add integration testing
/*
More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole('button', {
      name: /Log in/i,
    });
    await userEvent.click(loginButton);
  }
};
*/
