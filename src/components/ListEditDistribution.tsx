import Link from "next/link";
import { type z } from "zod";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { track } from "@vercel/analytics";

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
  ballotContains,
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
    return allocations?.filter((p) => ballotContains(p.projectId, ballot));
  }
  // Keep the already in ballot in state because we want to update these when user removes allocations
  const [alreadyInBallot, updateInBallot] = useState(
    itemsInBallot(listProjects)
  );

  function handleAddToBallot(form: { allocations: FormAllocations }) {
    track("AddListToBallotConfirm");
    add.mutate(form.allocations);
  }

  const allocations = listProjects
    .map((project) => {
      const inBallot = ballotContains(project.projectId, ballot);
      const ballotAmount = ballotContains(project.projectId, ballot)?.amount;
      return {
        ...project,
        // Find existing allocations from ballot
        amount: Number(ballotAmount ?? project.amount),
        // Always show projects in ballot first, next highest in ballot, finally in list
        sortAmount: inBallot
          ? Number.MAX_SAFE_INTEGER
          : ballotAmount ?? project.amount,
      };
    })
    .sort((a, b) => b.sortAmount - a.sortAmount);

  function handleOpenChange() {
    setOpen(false);
    updateInBallot(itemsInBallot(listProjects));
    add.reset(); // This is needed to reset add.isSuccess and show the allocations again
  }

  const showDialogTitle = !(add.isLoading || add.isSuccess);
  return (
    <div>
      <IconButton
        variant="primary"
        onClick={() => {
          track("AddListToBallot");
          setOpen(true);
        }}
        icon={AddBallot}
        className="w-full md:w-auto"
        disabled={!address || add.isSuccess}
      >
        {add.isSuccess ? "List added" : "Add to ballot"}
      </IconButton>
      <Dialog
        title={showDialogTitle ? `Edit distribution` : null}
        size={add.isSuccess ? "sm" : "md"}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        {add.isSuccess ? (
          <FeedbackDialog variant="success" icon={CircleCheck}>
            <div className="font-semibold">
              List added to ballot successfully!
            </div>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                as={Link}
                href={"/ballot"}
              >
                View ballot
              </Button>
              <Button
                className="w-full"
                variant="ghost"
                onClick={handleOpenChange}
              >
                Continue adding projects
              </Button>
            </div>
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
                title={`${alreadyInBallot.length} project(s) in the ${list.listName} list already exist in your ballot.`}
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
              <AllocationForm filter={{}} list={alreadyInBallot} />
            </div>
            <TotalOPBanner />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className={"w-full"}
                onClick={handleOpenChange}
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
        <div>{formatNumber(current)} OP</div>
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
        // This is weird, but it needs a second reset. Might be something with the indexes.
        setTimeout(() => form.reset(), 50);
        onReset();
      }}
    >
      Reset distribution
    </IconButton>
  );
};
