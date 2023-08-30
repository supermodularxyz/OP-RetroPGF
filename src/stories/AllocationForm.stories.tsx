import type { Meta, StoryObj } from "@storybook/react";
import { AllocationForm, AllocationSchema } from "~/components/AllocationList";
import { Form } from "~/components/ui/Form";
import { Th, Thead, Tr } from "~/components/ui/Table";
import { lists, projects } from "~/data/mock";

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
        schema={AllocationSchema}
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
    list: lists.slice(0, 5),
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
        schema={AllocationSchema}
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
