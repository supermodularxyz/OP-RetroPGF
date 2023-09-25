import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import ProjectsPage from "~/pages/projects";

const meta = {
  title: "Pages/Projects",
  component: ProjectsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProjectsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const loginButton = canvas.getByRole("button", { name: /Mock/i });
      await userEvent.click(loginButton);
    });
  },
};
