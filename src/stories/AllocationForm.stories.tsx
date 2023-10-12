import type { Meta, StoryObj } from "@storybook/react";
import { AllocationForm } from "~/components/AllocationList";
import { Form } from "~/components/ui/Form";
import { Th, Thead, Tr } from "~/components/ui/Table";
import { lists } from "~/data/mock";
import { AllocationsSchema } from "~/schemas/allocation";

import projects from "~/data/projects.json";

const allocations = projects
  .slice(0, 5)
  .map((p, i) => ({ ...p, amount: 1500 + i * 257 }));

const meta = {
  title: "Components/AllocationForm",
  component: AllocationForm,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof AllocationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filter: {},
  },
  decorators: [
    (Story) => (
      <Form
        schema={AllocationsSchema}
        defaultValues={{ allocations }}
        onSubmit={(values) => {
          console.log(values);
          return Promise.resolve();
        }}
      >
        <Story />
      </Form>
    ),
  ],
};

export const ListAndBallot: Story = {
  args: {
    list: lists[0]?.listContent
      .slice(0, 4)
      .map((p) => ({ projectId: p.RPGF3_Application_UID, amount: p.OPAmount })),
    header: (
      <Thead>
        <Tr>
          <Th></Th>
          <Th>List allocation</Th>
          <Th>Your allocation</Th>
          <Th></Th>
        </Tr>
      </Thead>
    ),
    filter: {},
  },
  decorators: [
    (Story) => (
      <Form
        schema={AllocationsSchema}
        defaultValues={{ allocations }}
        onSubmit={(values) => {
          console.log(values);
          return Promise.resolve();
        }}
      >
        <Story />
      </Form>
    ),
  ],
};
