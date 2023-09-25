import { useFormContext } from "react-hook-form";

import { Layout } from "~/components/Layout";
import { Form, FormControl, Input, Textarea } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { AllocationFormWithSearch } from "~/components/AllocationList";
import { Banner } from "~/components/ui/Banner";
import { OP_TO_ALLOCATE } from "~/components/BallotOverview";
import { sumBallot } from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { useCreateList } from "~/hooks/useCreateList";
import { type CreateList, CreateListSchema } from "~/schemas/list";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { toURL } from "~/hooks/useFilter";

const CreateListForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const create = useCreateList();
  const upload = useUploadMetadata();
  const { address } = useAccount();

  function handleSaveDraft(data: unknown) {
    console.log("save draft", data);
  }

  const error = create.error || upload.error;
  return (
    <Form
      schema={CreateListSchema}
      onSubmit={async (values) => {
        console.log(values);

        const { listName, ...list } = parseList(values);
        const listMetadataPtr = upload.data ?? (await upload.mutateAsync(list));

        create.mutate(
          {
            listName,
            listMetadataPtrType: 1,
            listMetadataPtr,
            owner: address!,
          },
          { onSuccess }
        );
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
      <FormControl name="impactEvaluationLink" label="Impact evaluation link">
        <Input placeholder="https://" />
      </FormControl>
      <div className="mb-4 rounded-2xl border border-neutral-300 p-6">
        <AllocationFormWithSearch onSave={handleSaveDraft} />
        <TotalOP />
      </div>

      <div className="mb-4 flex justify-end">
        <Button
          disabled={create.isLoading || upload.isLoading}
          variant="primary"
        >
          Create list
        </Button>
      </div>
      {error ? (
        <Banner variant="warning" className="overflow-x-scroll whitespace-pre">
          {JSON.stringify(error, null, 2)}
        </Banner>
      ) : null}
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
  const router = useRouter();
  return (
    <Layout>
      <CreateListForm
        onSuccess={() => router.push(`/lists/created?${toURL(router.query)}`)}
      />
    </Layout>
  );
}

function parseList({ allocations, ...list }: CreateList) {
  return {
    ...list,
    listContent: allocations.map(({ id, amount }) => ({
      RPGF3_Application_UID: id,
      OPAmount: amount,
    })),
  };
}
