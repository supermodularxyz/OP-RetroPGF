import { tv } from "tailwind-variants";
import { useRouter } from "next/router";
import { useController, useFormContext } from "react-hook-form";
import { useAccount } from "wagmi";

import { Layout } from "~/components/Layout";
import {
  Form,
  FormControl,
  Input,
  Textarea,
  Label,
} from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { AllocationFormWithSearch } from "~/components/AllocationList";
import { Banner } from "~/components/ui/Banner";
import { MAX_ALLOCATION_TOTAL } from "~/components/BallotOverview";
import { Allocation, sumBallot } from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { useCreateList } from "~/hooks/useCreateList";
import { type CreateList, CreateListSchema } from "~/schemas/list";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { toURL } from "~/hooks/useFilter";
import { createComponent } from "~/components/ui";
import { Link } from "~/components/ui/Link";
import { Dialog } from "~/components/ui/Dialog";
import { FeedbackDialog } from "~/components/FeedbackDialog";
import { Spinner } from "~/components/ui/Spinner";

import { impactCategoryLabels } from "~/hooks/useCategories";
import { Tag } from "~/components/ui/Tag";

const ListTags = () => {
  const { control, watch } = useFormContext();
  const { field } = useController({ name: "impactCategory", control });

  const selected = (watch("impactCategory") ?? []) as string[];

  return (
    <div className="mb-4">
      <Label>Impact categories</Label>
      <div className="flex flex-wrap gap-1">
        {Object.entries(impactCategoryLabels).map(([value, label]) => {
          const isSelected = selected.includes(value);
          return (
            <Tag
              size="lg"
              selected={isSelected}
              key={value}
              onClick={() => {
                field.onChange([value]);
              }}
            >
              {label}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

const createListErrors = {
  ACTION_REJECTED: "User rejected transaction",
};
const CreateListForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const create = useCreateList();
  const upload = useUploadMetadata();
  const { address } = useAccount();

  function handleSaveDraft(data: unknown) {
    console.log("save draft", data);
  }

  const error = create.error || upload.error;
  const isLoading = create.isLoading || upload.isLoading;

  return (
    <Form
      schema={CreateListSchema}
      onSubmit={async (values) => {
        console.log(values);

        const { listName, ...list } = parseList(values);

        const listMetadataPtr = upload.data ?? (await upload.mutateAsync(list));
        console.log(listName, list);
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
      <fieldset disabled={isLoading}>
        <FormControl name="listName" label="List name" required>
          <Input autoFocus placeholder="Give your list a name..." />
        </FormControl>
        <FormControl name="listDescription" label="Description" required>
          <Textarea rows={4} placeholder="What's this list about?" />
        </FormControl>
        <ListTags />
        <FormControl
          name="impactEvaluationDescription"
          label="Impact evaluation"
          required
        >
          <Textarea
            rows={4}
            placeholder="How did you evaluate the impact of projects? Help other badgeholders understand your methodology."
          />
        </FormControl>
        <FormControl
          name="impactEvaluationLink"
          label="Link to relevant resource"
        >
          <Input placeholder="https://" />
        </FormControl>

        <div className="mb-4 rounded-2xl border border-neutral-300 p-6">
          <AllocationFormWithSearch onSave={handleSaveDraft} />
          <TotalOP />
        </div>

        <div className="mb-4 flex justify-end">
          <CreateListButton isLoading={isLoading} error={error?.reason} />
        </div>

        <Dialog size="sm" isOpen={isLoading}>
          <FeedbackDialog variant="info" icon={Spinner}>
            <div className="font-semibold">Your list is being created...</div>
          </FeedbackDialog>
        </Dialog>
      </fieldset>
    </Form>
  );
};

const CreateListButton = ({ isLoading = false, error = "" }) => {
  const { address } = useAccount();
  const { formState } = useFormContext();

  const canCreate = Boolean(address && !isLoading && formState.isValid);
  return (
    <div className="flex items-center gap-4">
      {!address && <div>You must connect wallet to create a list</div>}
      {error && <Banner variant="warning">{error}</Banner>}
      <Button type="submit" disabled={!canCreate} variant="primary">
        Create list
      </Button>
    </div>
  );
};

const TotalOP = () => {
  const form = useFormContext();

  const allocations = (form.watch("allocations") ?? []) as Allocation[];

  const current = sumBallot(allocations);

  const exceeds = current - MAX_ALLOCATION_TOTAL;
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
      <div className="mb-4">
        <div className="mb-2 text-2xl font-semibold">Create a new list</div>

        <P>
          Lists are a new form of flexible delegation. Create a List to share
          your votes with other badgeholders. Be sure to reference some
          methodology for allocating OP to each project Be sure to check out the
          guidelines on creating a list:
        </P>
        <Link
          href={
            "https://plaid-cement-e44.notion.site/How-to-create-a-List-a543511a286b44cc83e4272431c96de3?pvs=4"
          }
          target="_blank"
        >
          📝 How to create a List
        </Link>
      </div>
      <CreateListForm
        onSuccess={() => router.push(`/lists/created?${toURL(router.query)}`)}
      />
    </Layout>
  );
}

function parseList({ allocations, ...list }: CreateList) {
  return {
    ...list,
    listContent: allocations.map(({ projectId, amount }) => ({
      RPGF3_Application_UID: projectId,
      OPAmount: amount,
    })),
  };
}

const P = createComponent(
  "p",
  tv({
    base: "pb-2 leading-relaxed",
  })
);
