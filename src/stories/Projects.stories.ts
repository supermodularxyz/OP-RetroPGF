import type { Meta, StoryObj } from "@storybook/react";
import { Projects } from "~/components/Projects";
import { type Project } from "~/hooks/useProjects";
import { initialFilter } from "~/hooks/useFilter";

import projects from "~/data/projects.json";

const meta = {
  title: "Components/Projects",
  component: Projects,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Projects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filter: initialFilter,
    projects: projects.slice(0, 6) as Project[],
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
