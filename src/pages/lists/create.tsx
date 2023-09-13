import { Layout } from "~/components/Layout";

import { Form, FormControl, Input, Textarea } from "~/components/ui/Form";
import { z } from "zod";
import { Button } from "~/components/ui/Button";
import { projects } from "~/data/mock";
import { AllocationForm } from "~/components/AllocationList";

const CreateList = z.object({
  title: z.string(),
});
const CreateListForm = () => {
  return (
    <Form
      defaultValues={{
        allocations: projects.slice(0, 5).map((p) => ({ ...p, amount: 0 })),
      }}
      schema={CreateList}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <div className="flex justify-between">
        <div className="mb-4 text-2xl font-semibold">Create a new list</div>
        <Button variant="primary">Create</Button>
      </div>
      <FormControl name="title" label="List name">
        <Input placeholder="Give your list a name..." />
      </FormControl>
      <FormControl name="description" label="Description">
        <Textarea rows={4} placeholder="What's this list about?" />
      </FormControl>
      <FormControl name="impact" label="Impact evaluation">
        <Textarea rows={4} placeholder="What impact does it seek to have?" />
      </FormControl>
      <div className="">
        <div className="pb-1">Add projects to list</div>
        <AllocationForm filter={{}} />
      </div>
    </Form>
  );
};

export default function CreateListPage() {
  return (
    <Layout>
      <CreateListForm />
    </Layout>
  );
}
