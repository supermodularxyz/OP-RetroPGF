import { useRouter } from "next/router";
import { useEffect } from "react";
import { Layout } from "~/components/Layout";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Form, FormControl, Input, Textarea } from "~/components/ui/Form";
import { z } from "zod";
import { Project, projects } from "~/hooks/useProjects";
import { ProjectImage, ProjectTitle } from "~/components/Projects";
import { Button } from "~/components/ui/Button";

import { Trash } from "lucide-react";
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
        <AllocationForm />
      </div>
    </Form>
  );
};

const Allocation = z.object({
  title: z.string(),
});
const AllocationForm = () => {
  const form = useFormContext();

  const { fields, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "allocations", // unique name for your Field Array
  });

  console.log(fields);

  return (
    <div className="rounded-xl border p-6">
      <FormControl name="projects">
        <Input type="search" placeholder={"Search for projects to add..."} />
      </FormControl>
      <div className="divide-y divide-neutral-200">
        {fields.map((field) => (
          <div key={field.id} className="flex justify-between gap-2 py-2">
            <div className="flex gap-2">
              <ProjectImage />
              <div>
                <ProjectTitle>{field.displayName}</ProjectTitle>
                <div className="text-muted">@project</div>
              </div>
            </div>
            <div className="flex w-[200px] gap-4">
              <div className="flex items-center">
                <Input placeholder="0" />
              </div>
              <div className="flex items-center">OP</div>
              <Button variant="ghost">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CreateListPage() {
  return (
    <Layout>
      <CreateListForm />
    </Layout>
  );
}
