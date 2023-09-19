import { Layout } from "~/components/Layout";

import { Form, FormControl, Input, Textarea } from "~/components/ui/Form";
import { z } from "zod";
import { Button } from "~/components/ui/Button";
import { AllocationFormWithSearch } from "~/components/AllocationList";
import { useFormContext } from "react-hook-form";
import { Banner } from "~/components/ui/Banner";
import { OP_TO_ALLOCATE } from "~/components/BallotOverview";
import { sumBallot } from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";

const CreateList = z.object({
  listName: z.string().min(1),
  listDescription: z.string().min(1),
  impactEvaluationDescription: z.string().min(1),
  allocations: z
    .array(
      z.object({
        id: z.string(),
        amount: z.number().min(1),
      })
    )
    .min(1)
    .refine(
      (val) => {
        const sum = val.reduce((acc, x) => acc + x.amount, 0);
        return sum > 0 && sum <= OP_TO_ALLOCATE;
      },
      { message: "Total amount OP is more than maximum" }
    ),
});

const CreateListForm = () => {
  function handleSaveDraft(data: unknown) {
    console.log("save draft", data);
  }
  return (
    <Form
      schema={CreateList}
      onSubmit={(values) => {
        console.log(values);
        alert("call create list api");
      }}
    >
      <div className="mb-4 text-2xl font-semibold">Create a new list</div>
      <FormControl name="listName" label="List name" required>
        <Input placeholder="Give your list a name..." />
      </FormControl>
      <FormControl name="listDescription" label="Description">
        <Textarea rows={4} placeholder="What's this list about?" />
      </FormControl>
      <FormControl name="impactEvaluationDescription" label="Impact evaluation">
        <Textarea rows={4} placeholder="What impact does it seek to have?" />
      </FormControl>
      <div className="mb-4 rounded-2xl border border-neutral-300 p-6">
        <AllocationFormWithSearch onSave={handleSaveDraft} />
        <TotalOP />
      </div>

      <div className="flex justify-end">
        <Button variant="primary">Create list</Button>
      </div>
    </Form>
  );
};
const TotalOP = () => {
  const form = useFormContext();

  const allocations = (form.watch("allocations") ?? []) as {
    id: string;
    amount: number;
  }[];

  const current = sumBallot(allocations);

  const exceeds = current - OP_TO_ALLOCATE;
  const isExceeding = exceeds > 0;
  console.log(form.formState.errors);
  return (
    <Banner className="mb-6" variant={isExceeding ? "warning" : "info"}>
      <div className={"flex justify-between font-semibold"}>
        <div>
          {isExceeding
            ? `Total exceeds by ${formatNumber(exceeds)} OP`
            : "Total"}
        </div>
        <div>{formatNumber(current)} OP</div>
      </div>
    </Banner>
  );
};

export default function CreateListPage() {
  return (
    <Layout>
      <CreateListForm />
    </Layout>
  );
}
