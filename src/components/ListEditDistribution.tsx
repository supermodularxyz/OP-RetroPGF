import Link from "next/link";
import { type z } from "zod";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";

import {
  AddBallot,
  ArrowRotateLeft,
  CircleCheck,
  CircleExclamation,
} from "~/components/icons";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "./ui/Dialog";
import { Form } from "./ui/Form";
import { type List } from "~/hooks/useLists";
import { AllocationForm } from "./AllocationList";
import { AllocationsSchema } from "~/schemas/allocation";
import { Banner } from "./ui/Banner";
import { formatNumber } from "~/utils/formatNumber";
import {
  Allocation,
  ballotToArray,
  sumBallot,
  useBallot,
} from "~/hooks/useBallot";
import { MAX_ALLOCATION_TOTAL } from "./BallotOverview";
import { useAddToBallot } from "~/hooks/useBallot";
import { Spinner } from "./ui/Spinner";
import { FeedbackDialog } from "./FeedbackDialog";

type FormAllocations = z.infer<typeof AllocationsSchema>["allocations"];

export const ListEditDistribution = ({
  list,
  listProjects,
}: {
  list: List;
  listProjects: FormAllocations;
}) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const { data: ballot } = useBallot();
  const add = useAddToBallot();

  // What list projects are already in the ballot?
  function itemsInBallot(allocations: Allocation[]) {
    return allocations?.filter((p) => ballot?.[p.id]);
  }
  const [alreadyInBallot, updateInBallot] = useState(
    itemsInBallot(listProjects)
  );

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
        variant="primary"
        onClick={() => setOpen(true)}
        icon={AddBallot}
        className="w-full md:w-auto"
        disabled={!address}
      >
        Add to ballot
      </IconButton>
      <Dialog
        title={showDialogTitle ? `Edit distribution` : null}
        size={add.isSuccess ? "sm" : "md"}
        isOpen={isOpen}
        onOpenChange={() => {
          setOpen(false);
          add.reset(); // This is needed to reset add.isSuccess and show the allocations again
        }}
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
                  You can change your OP alloaction based on the list or remove
                  the project(s) from the list to keep your existing allocation.
                </div>
              </Banner>
            ) : null}
            <ResetDistribution
              onReset={() => updateInBallot(itemsInBallot(listProjects))}
            />
            <div className="max-h-[480px] overflow-y-scroll">
              <AllocationForm
                filter={{}}
                list={alreadyInBallot}
                onSave={({ allocations }) =>
                  updateInBallot(itemsInBallot(allocations))
                }
              />
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
  const sum = sumBallot(ballotToArray(ballot));

  const allocations = (form.watch("allocations") ?? []) as FormAllocations;

  const current = sumBallot(allocations);

  const exceeds = current + sum - MAX_ALLOCATION_TOTAL;

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

const ResetDistribution = ({ onReset }: { onReset: () => void }) => {
  const form = useFormContext();

  return (
    <IconButton
      className={form.formState.isDirty ? "" : "text-gray-400"}
      icon={ArrowRotateLeft}
      variant="ghost"
      type="button"
      onClick={() => {
        form.reset();
        onReset();
      }}
    >
      Reset distribution
    </IconButton>
  );
};
