import { type z } from "zod";
import { Button, IconButton } from "~/components/ui/Button";
import {
  AddBallot,
  Adjustment,
  ArrowRotateLeft,
  CircleCheck,
  CircleExclamation,
} from "~/components/icons";
import { Dialog } from "./ui/Dialog";
import {
  useState,
  createElement,
  type FunctionComponent,
  type ComponentPropsWithoutRef,
} from "react";
import { Form } from "./ui/Form";
import { type List } from "~/hooks/useLists";
import { useAccount } from "wagmi";
import { AllocationForm } from "./AllocationList";
import { AllocationsSchema } from "~/schemas/allocation";
import { useFormContext } from "react-hook-form";
import { Banner } from "./ui/Banner";
import { formatNumber } from "~/utils/formatNumber";
import { sumBallot, useBallot } from "~/hooks/useBallot";
import { OP_TO_ALLOCATE } from "./BallotOverview";

import { useAddToBallot } from "~/hooks/useBallot";
import { Spinner } from "./ui/Spinner";
import Link from "next/link";

type FormAllocations = z.infer<typeof AllocationsSchema>["allocations"];

const FeedbackDialog = ({
  icon,
  variant,
  children,
}: ComponentPropsWithoutRef<"div"> & {
  variant: "success" | "info";
  icon: FunctionComponent<{ className: string }>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Banner variant={variant}>
        {createElement(icon, { className: "w-8 h-8" })}
      </Banner>
      {children}
    </div>
  );
};

export const ListEditDistribution = ({
  list,
  listProjects,
}: {
  list: List;
  listProjects: FormAllocations;
}) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();

  const { data: ballot } = useBallot();

  // What list projects are already in the ballot?
  const alreadyInBallot = listProjects.filter((p) => ballot?.[p.id]);
  console.log({ alreadyInBallot });

  function handleAddToBallot({
    allocations,
  }: {
    allocations: FormAllocations;
  }) {
    add.mutate(allocations);
  }

  const allocations = listProjects.map((p) => ({
    ...p,
    amount: ballot?.[p.id]?.amount ?? p.amount,
  }));
  const showDialogTitle = !(add.isLoading || add.isSuccess);
  return (
    <div>
      <IconButton
        variant="outline"
        onClick={() => setOpen(true)}
        icon={Adjustment}
        className="w-full md:w-auto"
        disabled={!address}
      >
        Edit distribution
      </IconButton>
      <Dialog
        size={add.isSuccess ? "sm" : "md"}
        isOpen={isOpen}
        onOpenChange={() => {
          setOpen(false);
          add.reset(); // This is needed to reset add.isSuccess and show the allocations again
        }}
        title={showDialogTitle ? `Edit distribution` : null}
      >
        {add.isSuccess ? (
          <FeedbackDialog variant="success" icon={CircleCheck}>
            <div className="font-semibold">List added to ballot</div>
            <Button as={Link} href={"/ballot"}>
              View ballot
            </Button>
          </FeedbackDialog>
        ) : add.isLoading ? (
          <FeedbackDialog variant="info" icon={Spinner}>
            <div className="font-semibold">Adding list to ballot</div>
          </FeedbackDialog>
        ) : (
          <Form
            schema={AllocationsSchema}
            defaultValues={{ allocations }}
            onSubmit={handleAddToBallot}
          >
            {alreadyInBallot.length ? (
              <Banner
                icon={CircleExclamation}
                variant="warning"
                title={`${alreadyInBallot.length} project(s) in the ${list.displayName} list already exist in your ballot.`}
              >
                <div className="flex gap-2">
                  You can change your OP allocation based on the list.
                </div>
              </Banner>
            ) : null}
            <ResetDistribution />
            <div className="max-h-[480px] overflow-y-scroll">
              <AllocationForm filter={{}} list={alreadyInBallot} />
            </div>
            <TotalOPBanner />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className={"w-full"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <IconButton
                type="submit"
                variant="primary"
                className={"w-full"}
                icon={AddBallot}
              >
                Add to ballot
              </IconButton>
            </div>
          </Form>
        )}
      </Dialog>
    </div>
  );
};
const TotalOPBanner = () => {
  const form = useFormContext();

  // Load existing ballot
  const { data: ballot } = useBallot();
  const sum = sumBallot(ballot?.votes);

  const allocations = (form.watch("allocations") ?? []) as FormAllocations;

  const current = sumBallot(allocations);

  const exceeds = current + sum - OP_TO_ALLOCATE;

  const isExceeding = exceeds > 0;
  return (
    <Banner className="mb-6" variant={isExceeding ? "warning" : "info"}>
      <div className={"flex justify-between font-semibold"}>
        <div>
          {isExceeding
            ? `Total exceeds by ${formatNumber(exceeds)} OP`
            : "Total"}
        </div>
        <div>{formatNumber(current + sum)} OP</div>
      </div>
    </Banner>
  );
};

const ResetDistribution = () => {
  const form = useFormContext();

  console.log(form.formState.isDirty);
  return (
    <IconButton
      className={form.formState.isDirty ? "" : "text-gray-400"}
      icon={ArrowRotateLeft}
      variant="ghost"
      type="button"
      onClick={() => form.reset()}
    >
      Reset distribution
    </IconButton>
  );
};
